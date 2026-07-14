"use client";

import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Flag, Activity, Flame, ArrowUpRight, ArrowDownRight, 
  SmilePlus, Trophy, Target, ShieldCheck, Heart, Brain, PenTool, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

export default function JejakPulih() {
  const { user, recordRelapse } = useUser();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isRelapseModalOpen, setIsRelapseModalOpen] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodHistory, setMoodHistory] = useState<{ date: string; emoji: number; note: string }[]>([]);

  // Load mood and mood history on mount
  useEffect(() => {
    const storedMood = localStorage.getItem("pulihku_daily_mood");
    if (storedMood) {
      setMood(parseInt(storedMood));
    }
    if (user?.answers?.mood_history) {
      setMoodHistory(user.answers.mood_history as any);
    }
  }, [user]);

  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;
  const totalRelapse = user?.relapseCount || 0;
  const successRate = Math.max(0, 100 - (totalRelapse * 4));
  const bestStreak = Math.max(user?.bestStreak || 0, streak);

  // Brain Recovery Goal logic based on user answers
  const frequency = user?.answers?.frequency as string || "weekly";
  const history = user?.answers?.history as string || "first_time";

  let targetDays = 60;
  if (frequency === "daily" || history === "tried_failed") {
    targetDays = 90;
  } else if (frequency === "weekly" || history === "long_streak") {
    targetDays = 60;
  } else {
    targetDays = 30;
  }

  const recoveryScore = Math.min(100, Math.round((streak / targetDays) * 100));

  // Dynamic Chart Data for clean days and relapses (last 12 days simulation)
  const lineChartData = [
    { name: "H 1", bersih: streak > 0 ? 1 : 0 },
    { name: "H 2", bersih: streak > 1 ? 2 : 0 },
    { name: "H 3", bersih: streak > 2 ? 3 : 0 },
    { name: "H 4", bersih: streak > 3 ? 4 : 0 },
    { name: "H 5", bersih: streak > 4 ? 5 : 0 },
    { name: "H 6", bersih: streak > 5 ? 6 : 0 },
    { name: "H 7", bersih: streak > 6 ? 7 : 0 },
    { name: "H 8", bersih: streak > 7 ? 8 : 0 },
    { name: "H 9", bersih: streak > 8 ? 9 : 0 },
    { name: "H 10", bersih: streak > 9 ? 10 : 0 },
    { name: "H 11", bersih: streak > 10 ? 11 : 0 },
    { name: "H 12", bersih: streak },
  ];

  // Accurate monthly stats based on user registration date
  const barChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthName = d.toLocaleString('id-ID', { month: 'short' });
    
    const userStart = user?.startDate ? parseISO(user.startDate) : new Date();
    
    // Start and End of this month slot
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    
    let bersih = 0;
    let relapse = 0;
    
    // Only show stats if this month is during or after the user's registration
    if (monthEnd >= userStart) {
      const isCurrentMonth = i === 5;
      bersih = isCurrentMonth ? streak : Math.max(0, differenceInDays(monthEnd, userStart));
      relapse = isCurrentMonth ? totalRelapse : 0;
    }
    
    return {
      name: monthName,
      bersih: Math.max(0, bersih),
      relapse: Math.max(0, relapse),
    };
  });

  const handleSaveMood = async () => {
    if (mood === null) {
      toast.error("Silakan pilih emoji mood Anda terlebih dahulu.");
      return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const newEntry = {
      date: todayStr,
      emoji: mood,
      note: moodNote.trim()
    };

    const updatedHistory = [newEntry, ...moodHistory.filter(h => h.date !== todayStr)];
    setMoodHistory(updatedHistory);
    
    if (user) {
      const updatedAnswers = { ...user.answers, mood_history: updatedHistory };
      const { error } = await supabase
        .from("users_pemulihan")
        .update({ answers: updatedAnswers })
        .eq("id", user.id);

      if (error) {
        console.error("Error syncing mood to Supabase:", error);
        toast.error("Gagal menyimpan mood ke server.");
      } else {
        const updatedUser = { ...user, answers: updatedAnswers };
        localStorage.setItem("pulihku_user", JSON.stringify(updatedUser));
        localStorage.setItem("pulihku_daily_mood", mood.toString());
        toast.success("Mood harian & catatan jurnal Anda berhasil disimpan!");
        setMoodNote("");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12">
      
      {/* Relapse Dialog Modal */}
      <Dialog open={isRelapseModalOpen} onOpenChange={setIsRelapseModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-none rounded-3xl text-foreground">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive animate-pulse" />
            Catat Relapse
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Tidak apa-apa, pemulihan bukanlah garis lurus melainkan sebuah proses belajar. Mencatat relapse akan mengatur ulang streak Anda menjadi 0 hari dan memotong XP Anda (-10 XP untuk relapse pertama hari ini, atau -20 XP untuk relapse berikutnya). Tetap semangat untuk mulai kembali!
          </DialogDescription>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" className="rounded-xl" onClick={() => setIsRelapseModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={() => {
              recordRelapse();
              setIsRelapseModalOpen(false);
            }}>
              Ya, Reset Streak & XP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">ANALISIS PROGRESS</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Jejak Pulih</h1>
          <p className="text-muted-foreground text-sm mt-1">Pantau kemajuan pemulihan, mood, dan evaluasi relapse Anda secara menyeluruh.</p>
        </div>
        <div>
          <Button 
            variant="destructive" 
            className="rounded-2xl py-6 font-bold shadow-md shadow-destructive/10 hover:shadow-destructive/20"
            onClick={() => setIsRelapseModalOpen(true)}
          >
            <Flag className="w-5 h-5 mr-2" />
            Catat Relapse
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-6 border-b border-border/80 pb-2">
        {["Overview", "Stats", "Mood"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-sm font-bold transition-all relative pb-2 px-1 text-foreground"
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" 
              />
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Circular Progress & Info */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card border border-border/80 rounded-3xl shadow-sm">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="var(--color-secondary)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="var(--color-primary)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * Math.min(streak, targetDays)) / targetDays}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">HARI BERSIH</span>
                <span className="text-5xl font-black text-foreground">{streak}</span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">DETERMINED</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-bold text-sm">Pencapaian Berjalan</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Hari ini Anda sedang bertumbuh sehat.</p>
            </div>
          </div>

          {/* Cards metrics */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Record Terpanjang */}
              <Card className="border border-border/80 shadow-sm rounded-3xl bg-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Rekor Terpanjang</span>
                  </div>
                  <p className="text-3xl font-black text-foreground">{bestStreak} <span className="text-xs font-normal text-muted-foreground">Hari</span></p>
                  <p className="text-[10px] text-muted-foreground mt-1">Histori hari bersih terbaik Anda.</p>
                </CardContent>
              </Card>

              {/* Recovery Score */}
              <Card className="border border-border/80 shadow-sm rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Recovery Score</span>
                  </div>
                  <p className="text-3xl font-black text-foreground">{recoveryScore}/100</p>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-2 border border-border/30">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${recoveryScore}%` }} />
                  </div>
                </CardContent>
              </Card>

              {/* Total Relapse */}
              <Card className="border border-border/80 shadow-sm rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Activity className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Relapse</span>
                  </div>
                  <p className="text-3xl font-black text-foreground">{totalRelapse} <span className="text-xs font-normal text-muted-foreground">Kali</span></p>
                  <p className="text-[10px] text-muted-foreground mt-1">Total pencatatan relapse aktif.</p>
                </CardContent>
              </Card>

              {/* Success Rate */}
              <Card className="border border-border/80 shadow-sm rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Success Rate</span>
                  </div>
                  <p className="text-3xl font-black text-foreground">{successRate}%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Tingkat efektivitas pemulihan.</p>
                </CardContent>
              </Card>
            </div>

            {/* Neuroscience Goal Reminder */}
            <div className="bg-primary/5 border border-primary/15 rounded-3xl p-5 flex items-start gap-4">
              <Brain className="w-6 h-6 text-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">Program Target Otak: {targetDays} Hari</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Berdasarkan profil Anda, otak membutuhkan {targetDays} hari pemulihan secara konsisten untuk mereset fungsi dopamin dan prefrontal cortex secara maksimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATS TAB: Modern Charts */}
      {activeTab === "Stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          
          {/* Chart 1: Daily Streak Progression (Area Chart) */}
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Progres Hari Bersih Berjalan</CardTitle>
              <CardDescription className="text-xs">Visualisasi peningkatan day-streak dalam periode ini</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBersih" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "16px", border: "1px solid var(--color-border)" }}
                      labelStyle={{ fontSize: 11, fontWeight: "bold" }}
                      itemStyle={{ fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="bersih" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBersih)" name="Hari Bersih" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Relapse & Clean Days per Month (Bar Chart) */}
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Analisis Relapse Bulanan</CardTitle>
              <CardDescription className="text-xs">Membandingkan hari berhasil vs frekuensi relapse</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "16px", border: "1px solid var(--color-border)" }}
                      labelStyle={{ fontSize: 11, fontWeight: "bold" }}
                      itemStyle={{ fontSize: 11 }}
                    />
                    <Bar dataKey="bersih" name="Hari Berhasil" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="relapse" name="Relapse" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MOOD TAB */}
      {activeTab === "Mood" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SmilePlus className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-bold">Mood Tracker & Jurnal Harian</CardTitle>
              </div>
              <CardDescription className="text-xs">Mencatat emosi membantu mengidentifikasi pola pemicu kecanduan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bagaimana perasaan Anda hari ini? Catat suasana emosi Anda serta tuangkan tulisan singkat tentang apa yang Anda rasakan untuk melatih kesadaran diri.
              </p>
              
              {/* Emoji Selection Grid */}
              <div className="flex justify-between gap-2 max-w-md mx-auto">
                {['😭', '😔', '😐', '🙂', '🤩'].map((emoji, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMood(i)}
                    className={`text-3xl transition-all p-4 rounded-2xl flex-1 flex items-center justify-center border border-transparent ${
                      mood === i 
                        ? 'bg-primary scale-110 shadow-lg shadow-primary/20 text-foreground border-primary/50' 
                        : 'bg-secondary/40 hover:bg-secondary hover:opacity-100 opacity-80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Jurnal Text Input Area */}
              <div className="space-y-2 max-w-md mx-auto">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" /> Apa yang Anda rasakan hari ini?
                </label>
                <Textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Tuliskan catatan pendek tentang emosi, tantangan, atau rasa syukur Anda hari ini..."
                  className="rounded-2xl border-border/60 min-h-24 resize-none focus-visible:ring-primary"
                />
                
                <Button 
                  onClick={handleSaveMood}
                  className="w-full rounded-2xl font-bold bg-primary text-foreground hover:bg-primary/95 mt-2 shadow-sm"
                >
                  Simpan Jurnal Mood
                </Button>
              </div>

              {/* Mood history timeline list */}
              <div className="max-w-md mx-auto pt-6 border-t border-border/60">
                <h4 className="font-bold text-xs text-muted-foreground uppercase flex items-center gap-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5" /> Riwayat Jurnal Mood
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {moodHistory.length === 0 ? (
                    <p className="text-xs text-center text-muted-foreground py-4">Belum ada riwayat mood tercatat.</p>
                  ) : (
                    moodHistory.map((item, idx) => (
                      <div key={idx} className="bg-secondary/40 border border-border/40 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
                        <span className="text-2xl shrink-0">
                          {['😭', '😔', '😐', '🙂', '🤩'][item.emoji]}
                        </span>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground">{item.date}</span>
                          </div>
                          <p className="text-xs text-foreground font-medium leading-relaxed">
                            {item.note || "Hanya mencatat mood (tanpa catatan)"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
