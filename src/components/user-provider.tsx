"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type UserData = {
  name: string;
  startDate: string;
  hasCompletedOnboarding: boolean;
  relapseCount: number;
  avatar?: string;
};

type UserContextType = {
  user: UserData | null;
  login: (name: string) => void;
  logout: () => void;
  recordRelapse: () => void;
  updateProfile: (name: string, avatar: string) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("pulihku_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (user && pathname === "/onboarding") {
      router.replace("/");
    }
  }, [user, pathname, isLoading, router]);

  const login = (name: string) => {
    const newUser: UserData = {
      name,
      startDate: new Date().toISOString(),
      hasCompletedOnboarding: true,
      relapseCount: 0,
      avatar: "🌱",
    };
    localStorage.setItem("pulihku_user", JSON.stringify(newUser));
    setUser(newUser);
    router.push("/");
  };

  const logout = () => {
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
  };

  const updateProfile = (name: string, avatar: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatar };
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, recordRelapse, updateProfile, isLoading }}>
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
