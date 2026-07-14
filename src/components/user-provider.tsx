"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserData = {
  id: string;
  name: string;
  startDate: string;
  hasCompletedOnboarding: boolean;
  relapseCount: number;
  avatar?: string;
  answers?: Record<string, string | string[]>;
};

type UserContextType = {
  user: UserData | null;
  login: (name: string, answers?: Record<string, string | string[]>) => Promise<void>;
  sendOtpCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtpCode: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recordRelapse: () => void;
  updateProfile: (name: string, avatar: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSession = async (session: any) => {
    if (session?.user) {
      setIsAuthenticated(true);
      const { data, error } = await supabase
        .from("users_pemulihan")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (data) {
        const userData: UserData = {
          id: data.id,
          name: data.name,
          startDate: data.start_date,
          hasCompletedOnboarding: true,
          relapseCount: data.relapse_count,
          avatar: data.avatar,
          answers: data.answers,
        };
        setUser(userData);
        localStorage.setItem("pulihku_user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("pulihku_user");
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("pulihku_user");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (user && pathname === "/onboarding") {
      router.replace("/");
    }
  }, [user, pathname, isLoading, router]);

  const sendOtpCode = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/onboarding`,
      }
    });

    if (error) {
      console.error("Error sending OTP:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const verifyOtpCode = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const login = async (name: string, answers?: Record<string, string | string[]>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("No authenticated user found.");
      return;
    }

    const id = session.user.id;
    const startDate = new Date().toISOString();
    
    const { error } = await supabase.from("users_pemulihan").insert({
      id,
      name,
      start_date: startDate,
      relapse_count: 0,
      avatar: "🌱",
      answers,
    });

    if (error) {
      console.error("Error saving to Supabase:", error);
      return;
    }

    const newUser: UserData = {
      id,
      name,
      startDate,
      hasCompletedOnboarding: true,
      relapseCount: 0,
      avatar: "🌱",
      answers,
    };
    localStorage.setItem("pulihku_user", JSON.stringify(newUser));
    setUser(newUser);
    router.push("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("pulihku_user");
    setUser(null);
    router.push("/onboarding");
  };

  const recordRelapse = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      startDate: new Date().toISOString(), // Reset streak
      relapseCount: (user.relapseCount || 0) + 1,
    };
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Sync to Supabase
    supabase
      .from("users_pemulihan")
      .update({ 
        start_date: updatedUser.startDate, 
        relapse_count: updatedUser.relapseCount 
      })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("Error updating relapse in Supabase:", error);
      });
  };

  const updateProfile = (name: string, avatar: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatar };
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Sync to Supabase
    supabase
      .from("users_pemulihan")
      .update({ name, avatar })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("Error updating profile in Supabase:", error);
      });
  };

  return (
    <UserContext.Provider value={{ user, login, sendOtpCode, verifyOtpCode, logout, recordRelapse, updateProfile, isLoading, isAuthenticated }}>
      {/* Jika masih loading atau user belum login (tapi bukan di halaman onboarding), jangan render anak-anak untuk mencegah flash konten */}
      {!isLoading && (user || pathname === "/onboarding") ? children : null}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
