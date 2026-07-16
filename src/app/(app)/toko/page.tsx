"use client";

import { useState } from "react";
import { useUser } from "@/components/user-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Snowflake, Award, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

const PREMIUM_AVATARS = [
  { emoji: "🦁", name: "Singa Emas", desc: "Lambang keberanian menghadapi hasrat.", cost: 300 },
  { emoji: "⚔️", name: "Ksatria Pulih", desc: "Lambang tekad pejuang sejati.", cost: 300 },
  { emoji: "👑", name: "Raja Kediri", desc: "Lambang penguasa penuh kendali diri.", cost: 300 },
  { emoji: "🔥", name: "Api Pemurnian", desc: "Lambang semangat membakar kebiasaan buruk.", cost: 300 },
  { emoji: "🦅", name: "Elang Angkasa", desc: "Lambang visi masa depan yang cerah.", cost: 300 },
];

export default function TokoPage() {
  const { user, updateUserData } = useUser();
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!user) return null;

  const currentXp = user.xp || 0;
  const shieldsCount = user.shieldsCount || 0;
  const freezesCount = user.streakFreezesCount || 0;
  const unlockedAvatars = user.unlockedAvatars || ["🌱"];

  const handleBuyShield = async () => {
    if (currentXp < 1000) {
      toast.error("XP Anda tidak cukup untuk membeli Perisai Pemulihan (Butuh 1000 XP).");
      return;
    }
    if (shieldsCount >= 3) {
      toast.warning("Stok perisai Anda sudah maksimal (Maks 3 perisai).");
      return;
    }

    setIsPurchasing(true);
    try {
      await updateUserData({
        xp: currentXp - 1000,
        shieldsCount: shieldsCount + 1,
      });
      toast.success("Berhasil membeli Perisai Pemulihan! +1 Perisai ditambahkan.");
    } catch (err) {
      toast.error("Gagal melakukan pembelian.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBuyFreeze = async () => {
    if (currentXp < 500) {
      toast.error("XP Anda tidak cukup untuk membeli Streak Freeze (Butuh 500 XP).");
      return;
    }

    setIsPurchasing(true);
    try {
      await updateUserData({
        xp: currentXp - 500,
        streakFreezesCount: freezesCount + 1,
      });
      toast.success("Berhasil membeli Streak Freeze! +1 Pengaman ditambahkan.");
    } catch (err) {
      toast.error("Gagal melakukan pembelian.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBuyAvatar = async (emoji: string, cost: number) => {
    if (unlockedAvatars.includes(emoji)) {
      // Equipping avatar
      setIsPurchasing(true);
      try {
        await updateUserData({ avatar: emoji });
        toast.success(`Avatar berhasil diubah ke ${emoji}!`);
      } catch (err) {
        toast.error("Gagal mengganti avatar.");
      } finally {
        setIsPurchasing(false);
      }
      return;
    }

    if (currentXp < cost) {
      toast.error(`XP Anda tidak cukup untuk membuka avatar ini (Butuh ${cost} XP).`);
      return;
    }

    setIsPurchasing(true);
    try {
      await updateUserData({
        xp: currentXp - cost,
        unlockedAvatars: [...unlockedAvatars, emoji],
        avatar: emoji, // Auto-equip on purchase
      });
      toast.success(`Berhasil membeli dan menggunakan avatar ${emoji}!`);
    } catch (err) {
      toast.error("Gagal membeli avatar.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">XP EXCHANGE</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Toko Pejuang</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tukarkan akumulasi XP hasil latihan kedisiplinan Anda dengan item pengaman pemulihan.
          </p>
        </div>
        <div className="bg-secondary/45 border rounded-2xl py-3 px-6 flex items-center gap-4 w-fit">
          <div>
            <p className="text-[10px] text-muted-foreground font-black uppercase">XP Anda</p>
            <p className="text-2xl font-black text-primary font-mono">{currentXp}</p>
          </div>
          <div className="border-l h-8 pl-4 flex flex-col justify-center">
            <span className="text-xs font-bold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> {shieldsCount} Perisai</span>
            <span className="text-xs font-bold flex items-center gap-1.5"><Snowflake className="w-3.5 h-3.5 text-sky-400" /> {freezesCount} Freeze</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Item Pengaman (Shield / Freeze) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Item Pengaman Recovery</h2>
          </div>

          <Card className="border-primary/20 relative overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield className="w-32 h-32 text-primary" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Perisai Pemulihan
                </CardTitle>
                <Badge className="bg-primary/20 text-foreground font-black">1.000 XP</Badge>
              </div>
              <CardDescription>
                Melindungi streak Anda saat terjadi ketidaksengajaan/relapse. Streak Anda tidak akan kembali ke 0.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maksimal memiliki 3 perisai. Penggunaan perisai dibatasi maksimal 1 kali dalam sebulan untuk menghindari toleransi berlebih terhadap hasrat pornografi.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBuyShield} 
                disabled={isPurchasing}
                className="w-full rounded-xl bg-primary text-foreground hover:bg-primary/90 font-bold"
              >
                Beli Perisai
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Snowflake className="w-32 h-32 text-sky-400" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Snowflake className="w-5 h-5 text-sky-400" /> Streak Freeze
                </CardTitle>
                <Badge className="bg-sky-400/20 text-foreground font-black">500 XP</Badge>
              </div>
              <CardDescription>
                Membekukan streak agar tidak mati ketika Anda harus bepergian tanpa internet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Item ini akan otomatis dikonsumsi jika Anda tidak melakukan check-in harian untuk menjaga agar streak hari bersih tidak dianggap gugur.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBuyFreeze} 
                disabled={isPurchasing}
                variant="outline"
                className="w-full rounded-xl font-bold"
              >
                Beli Streak Freeze
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Avatar Premium */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Avatar & Simbol Kejayaan Premium</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PREMIUM_AVATARS.map((item) => {
              const isUnlocked = unlockedAvatars.includes(item.emoji);
              const isEquipped = user.avatar === item.emoji;

              return (
                <div 
                  key={item.emoji}
                  className="flex items-center justify-between border rounded-3xl p-4 bg-card/65 hover:border-primary/45 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-3xl shrink-0 border">
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                        {item.name}
                        {isEquipped && <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 text-[9px] font-black uppercase py-0 px-1.5 flex items-center gap-0.5"><Check className="w-2.5 h-2.5" /> Dipakai</Badge>}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleBuyAvatar(item.emoji, item.cost)}
                    disabled={isPurchasing}
                    variant={isUnlocked ? (isEquipped ? "secondary" : "outline") : "default"}
                    className={`rounded-xl shrink-0 px-5 font-bold ${isUnlocked && !isEquipped ? "border-primary text-primary hover:bg-primary/10" : ""}`}
                  >
                    {isUnlocked 
                      ? (isEquipped ? "Digunakan" : "Gunakan") 
                      : `Buka (${item.cost} XP)`}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
