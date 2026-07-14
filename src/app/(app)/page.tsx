"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Zap, CheckCircle2, Brain, AlertCircle, Quote, Star } from "lucide-react";
import { PanicButton } from "@/components/panic-button";
import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRankDetails } from "@/lib/ranks";

export default function Dashboard() {
  const { user } = useUser();
  const { addXp } = useUser();
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  
  // Calculate current streak from user's startDate
  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;

  // Retrieve onboarding answers for dynamic Brain Recovery logic
  const frequency = user?.answers?.frequency as string || "weekly";
  const history = user?.answers?.history as string || "first_time";

  // Calculate addiction severity level and brain restoration goals
  let addictionLevel = "Sedang";
  let targetDays = 60;
  let restorationDescription = "";
  let neuroInsight = "";

  if (frequency === "daily" || history === "tried_failed") {
    addictionLevel = "Akut (Severe)";
    targetDays = 90;
    restorationDescription = "Reset Prefrontal Cortex & Regulasi Ulang Dopamin";
    neuroInsight = "Menurut neurosains, kecanduan pornografi akut melemahkan prefrontal cortex (pusat kendali diri) dan mendesensitisasi reseptor dopamin Anda. Otak membutuhkan waktu sekitar 90 hari pantang total untuk meluruhkan akumulasi protein deltaFosB, meregenerasi materi abu-abu di prefrontal cortex, serta mengembalikan sensitivitas dopamin alami ke tingkat normal.";
  } else if (frequency === "weekly" || history === "long_streak") {
    addictionLevel = "Sedang (Moderate)";
    targetDays = 60;
    restorationDescription = "Pembersihan Akumulasi Protein DeltaFosB";
    neuroInsight = "Pada kecanduan tingkat sedang, jalur dopamin telah terbiasa dengan rangsangan tinggi tetapi belum melumpuhkan kontrol diri Anda sepenuhnya. Diperlukan waktu sekitar 60 hari untuk memudarkan asosiasi saraf kecanduan lama, menormalkan sensitivitas reseptor, dan mengurangi kabut otak (brain fog) secara nyata.";
  } else {
    addictionLevel = "Ringan (Mild)";
    targetDays = 30;
    restorationDescription = "Resensitisasi Dopamin Awal";
    neuroInsight = "Untuk tingkat kecanduan ringan, perubahan struktur otak Anda bersifat minor. Periode pemulihan awal selama 30 hari sudah cukup untuk menyetel kembali toleransi dopamin dasar Anda, memulihkan motivasi harian, serta melatih kembali kendali diri atas godaan instan.";
  }

  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round((streak / targetDays) * 100));

  // Get Rank details
  const { rankName, badge, nextRank, levelProgressPercent } = getRankDetails(user?.xp || 0, streak);

  // Daily challenges definition
  const challenges = [
    { id: "read", title: "Membaca 15 Menit", desc: "Alihkan pikiranmu dengan membaca buku motivasi atau edukatif.", xp: 50 },
    { id: "workout", title: "Olahraga Ringan", desc: "Push-up 10x atau stretching untuk memicu dopamin alami yang sehat.", xp: 30 },
    { id: "water", title: "Minum Air Putih 2L", desc: "Menjaga hidrasi tubuh dan metabolisme agar pikiran tetap fokus.", xp: 20 },
  ];

  // Load completed challenges on mount
  useEffect(() => {
    const stored = localStorage.getItem("pulihku_completed_challenges");
    if (stored) {
      setCompletedChallenges(JSON.parse(stored));
    }
  }, []);

  const handleCompleteChallenge = (id: string, xpReward: number) => {
    const updated = { ...completedChallenges, [id]: true };
    setCompletedChallenges(updated);
    localStorage.setItem("pulihku_completed_challenges", JSON.stringify(updated));
    addXp(xpReward);
    toast.success(`Hebat! Tantangan selesai. +${xpReward} XP!`);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">PROGRAM PEMULIHAN</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard Pemulihan</h1>
          <p className="text-muted-foreground text-sm mt-1">Halo, {user?.name || "Pejuang"}! Hari ini adalah hari yang hebat untuk terus bertumbuh.</p>
        </div>
        <div className="flex items-center gap-3">
          <PanicButton />
        </div>
      </div>

      {/* Grid Layout - Asymmetric Premium Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Utama (Kiri): Streak & Brain Recovery Plan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Card: Streak (Lime Green Solid Accent) */}
          <Card className="bg-primary text-primary-foreground border-none shadow-md overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <CardContent className="p-8 relative">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-foreground/80 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/75">Hari Bertumbuh</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter leading-none">{streak}</span>
                <span className="text-2xl font-bold text-foreground/80">Hari Bersih</span>
              </div>
              <p className="text-sm mt-4 text-foreground/80 font-medium">
                {streak === 0 
                  ? "Hari pertama dari kehidupan barumu dimulai sekarang. Tetap kuat!" 
                  : `Anda berhasil melewati ${streak} hari tanpa pornografi. Lanjutkan perjuangan!`}
              </p>
            </CardContent>
          </Card>

          {/* Brain Restoration Recovery Card */}
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-foreground">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Progres Pemulihan Otak</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Berdasarkan neurosains kecanduan</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/20 text-foreground border-primary/30 font-bold px-3 py-1 text-xs">
                  Kecanduan: {addictionLevel}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Progress Tracker */}
              <div className="bg-secondary/40 p-5 rounded-2xl border border-border/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-muted-foreground">Target Pemulihan</span>
                  <span className="text-sm font-bold text-foreground">{streak} / {targetDays} Hari</span>
                </div>
                <Progress value={progressPercent} className="h-4 bg-background" />
                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground font-semibold">
                  <span>Mulai</span>
                  <span className="text-foreground font-bold">{progressPercent}% Pemulihan Otak</span>
                  <span>{targetDays} Hari ({restorationDescription})</span>
                </div>
              </div>

              {/* Neuroscience Insight Block */}
              <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Analisis Medis & Neurosains</h4>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed font-medium">
                    {neuroInsight}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Stats, Ranks & Daily Challenges */}
        <div className="space-y-6">
          
          {/* Card: Ranks & Level Progress */}
          <Card className="border border-border/80 shadow-sm rounded-3xl bg-secondary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl shadow-inner border border-primary/30">
                  {badge}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Level Pengguna</p>
                  <h4 className="text-lg font-black text-foreground flex items-center gap-1.5">{rankName}</h4>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                  <span>Progres Level ({user?.xp || 0} XP)</span>
                  <span>{levelProgressPercent}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-500 rounded-full" style={{ width: `${levelProgressPercent}%` }} />
                </div>
                {nextRank !== "Maksimum" && (
                  <p className="text-[9px] text-muted-foreground font-medium">
                    Butuh XP untuk naik ke <span className="text-foreground font-bold">{nextRank}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card: Record & Score */}
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardContent className="p-6 space-y-4">
              {/* Best Streak */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2.5 rounded-xl text-yellow-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rekor Terpanjang</p>
                    <p className="text-base font-bold text-foreground">{streak > 0 ? streak : 0} Hari</p>
                  </div>
                </div>
              </div>

              {/* Recovery Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2.5 rounded-xl text-primary">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Recovery Score</p>
                    <p className="text-base font-bold text-foreground">{Math.min(100, Math.round((streak / targetDays) * 100))}/100</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Daily Challenges List (Min 3) */}
          <Card className="border border-primary/20 bg-primary/5 overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl text-foreground">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Tantangan Harian</CardTitle>
                  <CardDescription className="text-xs">Selesaikan tugas produktif untuk meraih XP</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((ch) => {
                const isCompleted = !!completedChallenges[ch.id];
                return (
                  <div key={ch.id} className="bg-background p-4 rounded-2xl border border-border/40 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className={`font-bold text-sm ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {ch.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {ch.desc}
                        </p>
                      </div>
                      <Badge className="bg-primary/20 text-foreground text-[10px] font-black shrink-0 px-2 py-0.5">
                        +{ch.xp} XP
                      </Badge>
                    </div>
                    
                    <Button 
                      variant={isCompleted ? "secondary" : "default"}
                      disabled={isCompleted}
                      size="sm"
                      className="w-full rounded-xl text-xs h-9 font-bold"
                      onClick={() => handleCompleteChallenge(ch.id, ch.xp)}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" /> Selesai
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5" /> Tandai Selesai
                        </span>
                      )}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote */}
      <Card className="bg-secondary/40 border border-border/60 rounded-3xl">
        <CardContent className="p-8 flex items-center gap-4 max-w-3xl mx-auto">
          <Quote className="w-8 h-8 text-primary shrink-0 opacity-60" />
          <p className="text-base italic text-muted-foreground leading-relaxed font-medium">
            "Kekuatan sejati bukanlah tidak pernah jatuh, melainkan selalu bangkit setiap kali kita jatuh."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
