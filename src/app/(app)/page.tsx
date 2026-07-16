"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Zap, CheckCircle2, Brain, AlertCircle, Quote, Star, Medal, Users } from "lucide-react";
import { PanicButton } from "@/components/panic-button";
import { useUser } from "@/components/user-provider";
import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRankDetails } from "@/lib/ranks";

const CHALLENGE_POOL = [
  { id: "read", title: "Membaca 5 Halaman Buku", desc: "Alihkan pikiranmu dengan membaca buku non-fiksi atau edukatif.", xp: 50 },
  { id: "workout", title: "Olahraga Ringan / Push-up", desc: "Lakukan 10x push-up atau peregangan ringan untuk melatih fisik.", xp: 30 },
  { id: "water", title: "Minum Air Putih 2L", desc: "Menjaga hidrasi tubuh agar pikiran tetap jernih dan fokus.", xp: 20 },
  { id: "bed", title: "Merapikan Tempat Tidur", desc: "Membangun disiplin terkecil pertama di pagi hari.", xp: 20 },
  { id: "meditate", title: "Meditasi Hening 2 Menit", desc: "Tenangkan saraf pusat dan latih kesadaran penuh (mindfulness).", xp: 30 },
  { id: "journal", title: "Tulis 3 Hal yang Disyukuri", desc: "Membantu melatih otak melihat hal-hal positif.", xp: 30 },
  { id: "walk", title: "Berjalan Kaki 5 Menit", desc: "Mendapatkan udara segar di luar untuk menjernihkan pikiran.", xp: 25 },
  { id: "clean", title: "Bersihkan Meja Belajar/Kerja", desc: "Lingkungan yang bersih meredam tingkat stres mental.", xp: 25 },
  { id: "breathe", title: "Latihan Napas Dalam 5 Kali", desc: "Menstabilkan detak jantung dan merilekskan pikiran.", xp: 20 },
  { id: "music", title: "Dengarkan Musik Klasik/Relaksasi", desc: "Membantu menaikkan mood secara sehat tanpa visual berlebih.", xp: 20 }
];

export default function Dashboard() {
  const { user } = useUser();
  const { addXp } = useUser();

  // Streak days calculation
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

  // Ranks based on new larger XP scheme
  const { rankName, badge, nextRank, levelProgressPercent } = getRankDetails(user?.xp || 0, streak);

  // States for sequential daily challenges
  const [todayChallenges, setTodayChallenges] = useState<typeof CHALLENGE_POOL>([]);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0); // 0, 1, 2, or 3 (all completed)

  // State for Leaderboard
  const [leaderboard, setLeaderboard] = useState<{ name: string; avatar: string; streak: number }[]>([]);

  // Choose 3 challenges based on date seed
  useEffect(() => {
    const getDailyChallenges = () => {
      const today = new Date().toDateString(); // e.g. "Wed Jul 15 2026"
      let hash = 0;
      for (let i = 0; i < today.length; i++) {
        hash = today.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const selected: typeof CHALLENGE_POOL = [];
      const tempPool = [...CHALLENGE_POOL];
      
      for (let j = 0; j < 3; j++) {
        const index = Math.abs(hash + j) % tempPool.length;
        selected.push(tempPool[index]);
        tempPool.splice(index, 1);
      }
      return selected;
    };

    const daily = getDailyChallenges();
    setTodayChallenges(daily);

    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem("pulihku_challenge_date");
    const storedIndex = localStorage.getItem("pulihku_challenge_index");

    if (storedDate === todayStr) {
      if (storedIndex) {
        setActiveChallengeIndex(parseInt(storedIndex));
      }
    } else {
      setActiveChallengeIndex(0);
      localStorage.setItem("pulihku_challenge_date", todayStr);
      localStorage.setItem("pulihku_challenge_index", "0");
    }
  }, []);

  // Fetch top 10 users for Leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      let queryResult = await supabase
        .from("users_pemulihan")
        .select("name, avatar, start_date, best_streak");

      let leaderboardData = queryResult.data;

      if (queryResult.error) {
        console.warn("Leaderboard error (possibly best_streak column missing), retrying basic select:", queryResult.error.message);
        const retryResult = await supabase
          .from("users_pemulihan")
          .select("name, avatar, start_date");
        
        if (retryResult.error) {
          console.error("Leaderboard fallback query failed:", retryResult.error);
          return;
        }
        leaderboardData = retryResult.data as any;
      }
      
      if (leaderboardData) {
        const usersWithStreak = leaderboardData.map((u: any) => {
          const currentStreak = u.start_date ? differenceInDays(new Date(), parseISO(u.start_date)) : 0;
          const bestStreak = u.best_streak || 0;
          return {
            name: u.name || "Pejuang",
            avatar: u.avatar || "🌱",
            streak: currentStreak
          };
        });

        // Sort descending by streak, take top 10
        const sorted = usersWithStreak
          .sort((a, b) => b.streak - a.streak)
          .slice(0, 10);

        setLeaderboard(sorted);
      }
    };

    fetchLeaderboard();
  }, [streak]);

  const handleCompleteChallenge = (ch: typeof CHALLENGE_POOL[0]) => {
    const nextIndex = activeChallengeIndex + 1;
    setActiveChallengeIndex(nextIndex);
    localStorage.setItem("pulihku_challenge_index", nextIndex.toString());
    addXp(ch.xp);
    toast.success(`Tantangan "${ch.title}" Selesai! +${ch.xp} XP!`);
  };

  const activeChallenge = todayChallenges[activeChallengeIndex];

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


          {/* Card: Leaderboard (Top 10) */}
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Papan Peringkat Top 10
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-center text-muted-foreground p-4">Tidak ada data leaderboard.</p>
                ) : (
                  leaderboard.map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-muted-foreground/80 w-4">{i + 1}</span>
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm border">
                          {u.avatar}
                        </div>
                        <span className="text-xs font-bold text-foreground max-w-[120px] truncate">{u.name}</span>
                      </div>
                      <Badge className="bg-primary/20 text-foreground text-[10px] font-black">
                        {u.streak} Hari
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card: Sequential Daily Challenges (1 at a time) */}
          <Card className="border border-primary/20 bg-primary/5 overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl text-foreground">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold">Tantangan Harian</CardTitle>
                    <Badge variant="outline" className="text-[9px] bg-background font-black py-0 px-2">
                      {activeChallengeIndex}/3 Selesai
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">Selesaikan secara berurutan untuk naik level</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeChallengeIndex >= 3 ? (
                <div className="bg-background/80 p-6 rounded-2xl border border-primary/20 text-center space-y-2 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-extrabold text-sm text-foreground">Semua Tantangan Selesai!</h4>
                  <p className="text-[10px] text-muted-foreground">
                    Hebat! Kamu telah menyelesaikan 3 tantangan hari ini. Kembali besok untuk tantangan baru!
                  </p>
                </div>
              ) : activeChallenge ? (
                <div className="bg-background p-4 rounded-2xl border border-border/40 space-y-3 shadow-sm animate-in fade-in duration-300">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">TANTANGAN KE-{activeChallengeIndex + 1}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">
                        {activeChallenge.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {activeChallenge.desc}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-foreground text-[10px] font-black shrink-0 px-2 py-0.5">
                      +{activeChallenge.xp} XP
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full rounded-xl text-xs h-9 font-bold bg-primary text-foreground hover:bg-primary/90"
                    onClick={() => handleCompleteChallenge(activeChallenge)}
                  >
                    <Star className="w-3.5 h-3.5 mr-1" /> Tandai Selesai & Lanjut
                  </Button>
                </div>
              ) : null}
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
