"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "sonner";
import { initAnalytics, trackEvent } from "@/lib/analytics";
import { getRankDetails } from "@/lib/ranks";

type UserData = {
  id: string;
  name: string;
  startDate: string;
  hasCompletedOnboarding: boolean;
  relapseCount: number;
  avatar?: string;
  age?: number;
  answers?: Record<string, string | string[]>;
  xp?: number;
  bestStreak?: number;
  shieldsCount?: number;
  streakFreezesCount?: number;
  unlockedAvatars?: string[];
};

type UserContextType = {
  user: UserData | null;
  login: (name: string, answers?: Record<string, string | string[]>) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmailPassword: (email: string, password: string, name: string, age: number) => Promise<{ success: boolean; error?: string }>;
  signInWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recordRelapse: () => void;
  updateProfile: (name: string, avatar: string) => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  addXp: (amount: number) => void;
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

  const triggerEmail = async (subject: string, html: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!email) return;

      await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, subject, html }),
      });
    } catch (e) {
      console.error("Gagal mengirim email transaksional:", e);
    }
  };

  const handleSession = async (session: any) => {
    if (session?.user) {
      setIsAuthenticated(true);
      const { data, error } = await supabase
        .from("users_pemulihan")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      const hasAnswers = data?.answers && Object.keys(data.answers).length > 0;
      if (data && hasAnswers) {
        const userData: UserData = {
          id: data.id,
          name: data.name,
          startDate: data.start_date,
          hasCompletedOnboarding: true,
          relapseCount: data.relapse_count,
          avatar: data.avatar,
          age: data.age,
          answers: data.answers,
          xp: data.xp || 0,
          bestStreak: data.best_streak || 0,
          shieldsCount: data.shields_count || 0,
          streakFreezesCount: data.streak_freezes_count || 0,
          unlockedAvatars: data.unlocked_avatars || ["🌱"],
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
    initAnalytics();

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

  const signUpWithEmailPassword = async (email: string, password: string, name: string, age: number): Promise<{ success: boolean; error?: string }> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Error signing up:", authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Gagal membuat pengguna." };
    }

    const id = authData.user.id;
    const startDate = new Date().toISOString();
    const { error: profileError } = await supabase.from("users_pemulihan").insert({
      id,
      name,
      age,
      start_date: startDate,
      relapse_count: 0,
      avatar: "🌱",
      answers: {},
    });

    if (profileError) {
      console.error("Error saving profile:", profileError);
      return { success: false, error: profileError.message };
    }

    return { success: true };
  };

  const signInWithEmailPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const login = async (name: string, answers?: Record<string, string | string[]>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("No authenticated user found.");
      return { success: false, error: "Sesi tidak ditemukan. Silakan login kembali." };
    }

    const id = session.user.id;
    const startDate = new Date().toISOString();
    
    const { data: currentProfile } = await supabase
      .from("users_pemulihan")
      .select("age")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("users_pemulihan").upsert({
      id,
      name,
      age: currentProfile?.age || null,
      start_date: startDate,
      relapse_count: 0,
      avatar: "🌱",
      answers,
    });

    if (error) {
      console.error("Error saving to Supabase:", error);
      return { success: false, error: error.message };
    }

    const newUser: UserData = {
      id,
      name,
      startDate,
      hasCompletedOnboarding: true,
      relapseCount: 0,
      avatar: "🌱",
      age: currentProfile?.age || undefined,
      answers,
      xp: 0,
      bestStreak: 0,
    };
    localStorage.setItem("pulihku_user", JSON.stringify(newUser));
    setUser(newUser);

    // Track Onboarding Completed Event in PostHog
    trackEvent("onboarding_completed", {
      userId: id,
      name,
      age: currentProfile?.age || null,
      ...answers,
    });

    // Send Welcome Email via Resend API
    triggerEmail(
      "Selamat Datang di Pulihku!",
      `<h1>Halo ${name}!</h1>
       <p>Selamat bergabung di keluarga besar Pulihku. Anda baru saja menyelesaikan onboarding awal.</p>
       <p>Kami di sini siap mendampingi Anda melewati perjalanan pemulihan ini secara aman dan pribadi. Manfaatkan fitur-fitur seperti <strong>Panic Button</strong> saat Anda merasa kewalahan, atau mengobrol dengan <strong>AI Sahabat Pulih</strong> kapan saja.</p>
       <br />
       <p>Salam hangat,<br />Tim Pulihku</p>`
    );

    router.push("/");
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("pulihku_user");
    setUser(null);
    router.push("/onboarding");
  };

  const recordRelapse = () => {
    if (!user) return;

    // Check if user has active shield (shields_count > 0)
    if (user.shieldsCount && user.shieldsCount > 0) {
      const updatedUser = {
        ...user,
        shieldsCount: user.shieldsCount - 1,
      };
      localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("🛡️ Perisai Pemulihan Aktif! Streak Anda berhasil diselamatkan dari reset!");

      // Track Shield Used Event in PostHog
      trackEvent("relapse_prevented_by_shield", {
        userId: user.id,
        shieldsCountRemaining: updatedUser.shieldsCount,
      });

      // Send Shield Use Warning Email
      triggerEmail(
        "Perisai Pemulihan Aktif - Streak Terselamatkan",
        `<h1>Halo ${user.name}!</h1>
         <p>Kami mendeteksi adanya laporan relapse hari ini. Untungnya, <strong>Perisai Pemulihan (Shield)</strong> Anda sedang aktif.</p>
         <p>Streak hari bersih Anda berhasil diselamatkan dan tidak kembali ke 0. Namun, gunakan kesempatan ini sebagai pengingat untuk tetap waspada. Sisa perisai Anda: ${updatedUser.shieldsCount}.</p>
         <br />
         <p>Tetap kuat!<br />Tim Pulihku</p>`
      );

      // Sync to Supabase
      supabase
        .from("users_pemulihan")
        .update({ 
          shields_count: updatedUser.shieldsCount 
        })
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("Error updating shield count in Supabase:", error);
        });

      // Log relapse status to users_daily_logs table
      const todayISO = new Date().toISOString().split("T")[0];
      supabase
        .from("users_daily_logs")
        .upsert({
          user_id: user.id,
          log_date: todayISO,
          clean_status: false,
        }, { onConflict: "user_id, log_date" })
        .then(({ error }) => {
          if (error) console.error("Error logging relapse in users_daily_logs:", error);
        });
      return;
    }

    // Calculate current streak
    const currentStreak = differenceInDays(new Date(), parseISO(user.startDate));
    const newBestStreak = Math.max(user.bestStreak || 0, currentStreak);

    // Relapse count penalty logic
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem("pulihku_relapse_today_date");
    let relapseTodayCount = 0;

    if (storedDate === todayStr) {
      const storedCount = localStorage.getItem("pulihku_relapse_today_count");
      if (storedCount) relapseTodayCount = parseInt(storedCount);
    } else {
      localStorage.setItem("pulihku_relapse_today_date", todayStr);
    }

    const newRelapseTodayCount = relapseTodayCount + 1;
    localStorage.setItem("pulihku_relapse_today_count", newRelapseTodayCount.toString());

    // Penalty: 1st relapse = 10 XP, subsequent relapses = 20 XP
    const penalty = newRelapseTodayCount === 1 ? 10 : 20;
    const newXp = Math.max(0, (user.xp || 0) - penalty);

    // Verify if new rank allows current avatar (otherwise demote to '🌱')
    let finalAvatar = user.avatar || "🌱";
    const { rankName: newRank } = getRankDetails(newXp, 0);
    
    const avatarRequirements: Record<string, string[]> = {
      "🌿": ["Tunas", "Akar Kuat", "Pohon Kokoh", "Hutan Raksasa"],
      "🪵": ["Akar Kuat", "Pohon Kokoh", "Hutan Raksasa"],
      "🌳": ["Pohon Kokoh", "Hutan Raksasa"],
      "🌲": ["Hutan Raksasa"]
    };

    if (avatarRequirements[finalAvatar] && !avatarRequirements[finalAvatar].includes(newRank)) {
      finalAvatar = "🌱";
      toast.warning("Level Anda turun! Avatar tingkat tinggi Anda sebelumnya telah terkunci kembali.");
    }

    const updatedUser = {
      ...user,
      startDate: new Date().toISOString(), // Reset current streak to 0
      relapseCount: (user.relapseCount || 0) + 1,
      xp: newXp,
      bestStreak: newBestStreak,
      avatar: finalAvatar
    };
    
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    toast.error(`Relapse tercatat! Streak di-reset. XP Anda berkurang -${penalty} XP!`);

    // Track Relapse Event in PostHog
    trackEvent("relapse_recorded", {
      userId: user.id,
      currentStreak,
      penalty,
      newXp,
    });

    // Send Relapse Support Email via Resend API
    triggerEmail(
      "Tetap Semangat, Mulai Lagi Hari Ini",
      `<h1>Halo ${user.name},</h1>
       <p>Jangan berkecil hati. Mengalami relapse adalah bagian dari proses naik-turun dalam pemulihan.</p>
       <p>Kami mencatat hari bersih Anda di-reset ke 0 hari, dan XP Anda terpotong sebesar -${penalty} XP. Tapi yang terpenting adalah komitmen Anda hari ini untuk mulai kembali.</p>
       <p>Cobalah bernapas perlahan, gunakan fitur <strong>Box Breathing</strong> di Panic Button, atau curhat ke <strong>AI Sahabat Pulih</strong>.</p>
       <br />
       <p>Kami percaya Anda bisa melakukannya!<br />Tim Pulihku</p>`
    );

    // Sync to Supabase - users_pemulihan
    supabase
      .from("users_pemulihan")
      .update({ 
        start_date: updatedUser.startDate, 
        relapse_count: updatedUser.relapseCount,
        xp: updatedUser.xp,
        best_streak: updatedUser.bestStreak,
        avatar: updatedUser.avatar
      })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("Error updating relapse in Supabase:", error);
      });

    // Log relapse status to users_daily_logs table
    const todayISO = new Date().toISOString().split("T")[0];
    supabase
      .from("users_daily_logs")
      .upsert({
        user_id: user.id,
        log_date: todayISO,
        clean_status: false,
      }, { onConflict: "user_id, log_date" })
      .then(({ error }) => {
        if (error) console.error("Error logging relapse in users_daily_logs:", error);
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

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    const dbPayload: any = {};
    if (data.name !== undefined) dbPayload.name = data.name;
    if (data.avatar !== undefined) dbPayload.avatar = data.avatar;
    if (data.xp !== undefined) dbPayload.xp = data.xp;
    if (data.bestStreak !== undefined) dbPayload.best_streak = data.bestStreak;
    if (data.shieldsCount !== undefined) dbPayload.shields_count = data.shieldsCount;
    if (data.streakFreezesCount !== undefined) dbPayload.streak_freezes_count = data.streakFreezesCount;
    if (data.unlockedAvatars !== undefined) dbPayload.unlocked_avatars = data.unlockedAvatars;

    const { error } = await supabase
      .from("users_pemulihan")
      .update(dbPayload)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user data in Supabase:", error.message);
    }
  };

  const addXp = (amount: number) => {
    if (!user) return;

    // Daily XP cap logic (Max 50 XP/day)
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem("pulihku_xp_date");
    let xpEarnedToday = 0;

    if (storedDate === todayStr) {
      const storedXp = localStorage.getItem("pulihku_xp_earned_today");
      if (storedXp) xpEarnedToday = parseInt(storedXp);
    } else {
      localStorage.setItem("pulihku_xp_date", todayStr);
    }

    if (xpEarnedToday >= 50) {
      toast.info("Batas XP harian tercapai (Maksimal 50 XP/hari).");
      return;
    }

    let addedAmount = amount;
    if (xpEarnedToday + amount > 50) {
      addedAmount = 50 - xpEarnedToday;
    }

    const currentXp = user.xp || 0;
    const updatedUser = {
      ...user,
      xp: currentXp + addedAmount
    };

    localStorage.setItem("pulihku_xp_earned_today", (xpEarnedToday + addedAmount).toString());
    localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Sync to Supabase
    supabase
      .from("users_pemulihan")
      .update({ xp: updatedUser.xp })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.warn("Note: Suppressed Supabase sync warning (column xp may not exist yet):", error.message);
      });
  };

  return (
    <UserContext.Provider value={{ user, login, signUpWithEmailPassword, signInWithEmailPassword, logout, recordRelapse, updateProfile, updateUserData, addXp, isLoading, isAuthenticated }}>
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
