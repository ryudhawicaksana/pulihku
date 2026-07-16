"use client";

import { useState } from "react";
import { useUser } from "@/components/user-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays, parseISO, format } from "date-fns";
import { id } from "date-fns/locale";
import { LogOut, Trophy, Target, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { getRankDetails } from "@/lib/ranks";

export default function ProfilPage() {
  const { user, updateProfile, logout } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "🌱");

  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;
  
  // Calculate Rank details based on shared neurosains & XP progression
  const { rankName, badge, nextRank, levelProgressPercent } = getRankDetails(user?.xp || 0, streak);
  const totalXp = user?.xp || 0;

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile(name, avatar);
    toast.success("Profil berhasil diperbarui!");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profil & Pengaturan</h1>
        <p className="text-muted-foreground text-lg">Kelola identitas dan pantau pencapaian perjalanan pulihmu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kolom Pengaturan Profil */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profil</CardTitle>
              <CardDescription>Pilih avatar dan julukan anonim yang membuatmu semangat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <label className="text-sm font-medium">Pilih Avatar</label>
                <div className="flex flex-wrap gap-3">
                  {/* Avatar Bonus (Selalu Terbuka) */}
                  <button
                    onClick={() => setAvatar("🕊️")}
                    className={`w-14 h-14 text-2xl flex items-center justify-center rounded-2xl transition-all ${
                      avatar === "🕊️" 
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30" 
                        : "bg-secondary hover:bg-secondary/70"
                    }`}
                  >
                    🕊️
                  </button>

                  {/* 5 Avatar Tingkat Level (Mengunci/Membuka Dinamis) */}
                  {[
                    { emoji: "🌱", levels: ["Benih", "Tunas", "Akar Kuat", "Pohon Kokoh", "Hutan Raksasa"] },
                    { emoji: "🌿", levels: ["Tunas", "Akar Kuat", "Pohon Kokoh", "Hutan Raksasa"] },
                    { emoji: "🪵", levels: ["Akar Kuat", "Pohon Kokoh", "Hutan Raksasa"] },
                    { emoji: "🌳", levels: ["Pohon Kokoh", "Hutan Raksasa"] },
                    { emoji: "🌲", levels: ["Hutan Raksasa"] }
                  ].map((item) => {
                    const isUnlocked = item.levels.includes(rankName);

                    return (
                      <button
                        key={item.emoji}
                        disabled={!isUnlocked}
                        onClick={() => setAvatar(item.emoji)}
                        className={`w-14 h-14 text-2xl flex items-center justify-center rounded-2xl transition-all relative ${
                          !isUnlocked
                            ? "bg-secondary/40 opacity-40 cursor-not-allowed grayscale"
                            : avatar === item.emoji 
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30" 
                            : "bg-secondary hover:bg-secondary/70"
                        }`}
                      >
                        {item.emoji}
                        {!isUnlocked && (
                          <span className="absolute -bottom-1 -right-1 bg-background border rounded-full p-0.5 text-[8px] font-black">
                            🔒
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Avatar Premium Hasil Pembelian Toko */}
                  {(user.unlockedAvatars || [])
                    .filter((emoji) => !["🕊️", "🌱", "🌿", "🪵", "🌳", "🌲"].includes(emoji))
                    .map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setAvatar(emoji)}
                        className={`w-14 h-14 text-2xl flex items-center justify-center rounded-2xl transition-all ${
                          avatar === emoji 
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30" 
                            : "bg-secondary hover:bg-secondary/70"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <label className="text-sm font-medium">Julukan / Nama</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-12"
                />
              </div>

              <Button onClick={handleSave} className="h-12 px-8">Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Info & Rank */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Trophy className="w-32 h-32 text-primary" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg">Rank Saat Ini</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center justify-center py-6">
              <div className="w-24 h-24 bg-background rounded-full shadow-xl flex items-center justify-center text-5xl mb-4 border-4 border-primary/20">
                {avatar}
              </div>
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-1.5">{rankName} <span className="text-xl">{badge}</span></h3>
              <p className="text-muted-foreground text-xs mt-1">{totalXp} XP Terkumpul</p>
              
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                  <span>Progres Level</span>
                  <span>{levelProgressPercent}%</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/40">
                  <div 
                    className="bg-primary h-full transition-all duration-500 rounded-full" 
                    style={{ width: `${levelProgressPercent}%` }} 
                  />
                </div>
                {nextRank !== "Maksimum" && (
                  <p className="text-[9px] text-center text-muted-foreground mt-1 font-semibold">
                    Target Berikutnya: <span className="text-foreground">{nextRank}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bergabung Sejak</p>
                  <p className="font-semibold">{format(parseISO(user.startDate), "dd MMMM yyyy", { locale: id })}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Relapse</p>
                  <p className="font-semibold">{user.relapseCount || 0} Kali</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="destructive" 
            className="w-full gap-2"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" /> Keluar / Reset Data
          </Button>
        </div>

      </div>
    </div>
  );
}
