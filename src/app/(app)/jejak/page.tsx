"use client";

import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { CheckCircle2, User as UserIcon, Flag, Activity, Flame, ArrowUpRight, ArrowDownRight, SmilePlus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  YAxis,
  Tooltip,
  Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JejakPulih() {
  const { user, recordRelapse } = useUser();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isRelapseModalOpen, setIsRelapseModalOpen] = useState(false);
  const [mood, setMood] = useState<number | null>(null);

  // Load mood from localStorage on mount
  useEffect(() => {
    const storedMood = localStorage.getItem("pulihku_daily_mood");
    if (storedMood) {
      setMood(parseInt(storedMood));
    }
  }, []);

  const handleMoodSelect = (index: number) => {
    setMood(index);
    localStorage.setItem("pulihku_daily_mood", index.toString());
    toast.success("Terima kasih! Mood harian Anda telah dicatat.");
  };

  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;
  const totalRelapse = user?.relapseCount || 0;
  const successRate = Math.max(0, 100 - (totalRelapse * 4));
  
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

  // Fake chart data for the progress line
  const lineChartData = [
    { name: "Day 1", value: 10 },
    { name: "Day 2", value: 20 },
    { name: "Day 3", value: 30 },
    { name: "Day 4", value: 40 },
    { name: "Day 5", value: 50 },
    { name: "Day 6", value: 60, relapse: true },
    { name: "Day 7", value: 10 },
    { name: "Day 8", value: 20 },
    { name: "Day 9", value: 30 },
    { name: "Day 10", value: 40 },
    { name: "Day 11", value: 50 },
    { name: "Day 12", value: 60 },
  ];

  // Generate 6 months of data ending in the current month for Stats
  const barChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const isCurrentMonth = i === 5;
    return {
      name: d.toLocaleString('id-ID', { month: 'short' }),
      sukses: isCurrentMonth ? streak : 0,
      relapse: isCurrentMonth ? totalRelapse : 0,
    };
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-8 max-w-2xl mx-auto w-full">
      <Dialog open={isRelapseModalOpen} onOpenChange={setIsRelapseModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-white/10 text-foreground">
          <DialogTitle>Catat Relapse</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tidak apa-apa, setiap perjalanan pasti ada kerikilnya. Apakah Anda yakin ingin mencatat relapse dan mengatur ulang streak Anda?
          </DialogDescription>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={() => setIsRelapseModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={() => {
              recordRelapse();
              setIsRelapseModalOpen(false);
              toast.error("Relapse tercatat. Mari bangkit dan mulai lagi dari sekarang!");
            }}>
              Ya, Catat Relapse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <h1 className="text-3xl font-bold tracking-tight">Overcome Urges</h1>
        <p className="text-xl text-foreground/80 mt-1">and Recover.</p>
        <Button 
          variant="destructive" 
          size="sm"
          className="absolute right-0 top-0 rounded-full shadow-md shadow-destructive/20"
          onClick={() => setIsRelapseModalOpen(true)}
        >
          <Flag className="w-4 h-4 mr-2" />
          Catat Relapse
        </Button>
      </div>

      {/* Title & Tabs */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Analytics</h2>
        <div className="flex gap-6 border-b border-white/10 pb-2">
          {["Overview", "Stats", "Mood"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-white rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Overview" && (
        <>
          {/* Circular Progress */}
          <div className="flex flex-col items-center justify-center mb-10 relative">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                {/* Progress Circle (Primary Purple) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="var(--color-primary)"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * Math.min(streak, 30)) / 30} // Assuming 30 days is full circle for this view
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Dashed outer ring for 'BREAKTHROUGH' */}
                <circle
                  cx="50"
                  cy="50"
                  r="52"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold tracking-widest text-white/60 mb-1">DAYS CLEAN</span>
                <span className="text-6xl font-bold">{streak}d</span>
                <span className="text-xs font-bold tracking-widest text-white/40 mt-2">DETERMINED</span>
              </div>

              {/* Breakthrough Marker */}
              <div className="absolute bottom-1 right-16 flex flex-col items-center">
                <div className="bg-white rounded-full p-0.5">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
                <span className="text-[10px] text-white/40 mt-1 rotate-12 -ml-4">BREAKTHROUGH</span>
              </div>
            </div>
          </div>

          {/* Recovery Score Card */}
          <Card className="border border-border/80 shadow-sm rounded-3xl mb-8">
            <CardContent className="p-6 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Recovery Score</h3>
                </div>
                <span className="font-bold text-primary text-base">{recoveryScore}/100</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-border/40">
                <div className="bg-primary h-full transition-all duration-500 rounded-full" style={{ width: `${recoveryScore}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Skor pemulihan Anda meningkat seiring bertambahnya hari bersih berdasarkan target pemulihan otak Anda ({targetDays} Hari).
              </p>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <div className="flex-1">
            <div className="flex flex-col mb-4">
              <h3 className="font-bold text-base">Progress:</h3>
              <div className="flex items-center text-xs text-destructive mt-1">
                <span className="font-bold mr-1">X</span> - Relapse
              </div>
            </div>
            
            <div className="h-32 w-full relative">
              {/* Subtle grid background */}
              <div className="absolute inset-0 grid grid-cols-6 border-b border-white/10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-r border-white/5 h-full" />
                ))}
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Line 
                    type="linear" 
                    dataKey="value" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.relapse) {
                        return (
                          <g key={`dot-${payload.name}`}>
                            <text x={cx} y={cy} dy={5} dx={-5} fill="var(--color-destructive)" fontSize="12" fontWeight="bold">X</text>
                          </g>
                        );
                      }
                      if (payload.name === 'Day 12') { // Last point arrow
                        return (
                          <g key={`arrow-${payload.name}`}>
                            <path d={`M${cx-4},${cy-4} L${cx+4},${cy} L${cx-4},${cy+4} Z`} fill="var(--color-primary)" transform={`rotate(-45 ${cx} ${cy})`} />
                          </g>
                        );
                      }
                      return <g key={`dot-${payload.name}`}></g>;
                    }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === "Stats" && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-card border-white/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Total Relapse</h3>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">{totalRelapse}</p>
                <div className="flex items-center text-sm text-primary font-medium">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>Menurun</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Kesuksesan</h3>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">{successRate}%</p>
                <div className="flex items-center text-sm text-primary font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>Hari bersih</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle>Statistik Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.5)" }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.5)" }}
                    />
                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    />
                    <Bar 
                      dataKey="sukses" 
                      name="Berhasil" 
                      fill="var(--color-primary)" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="relapse" 
                      name="Relapse" 
                      fill="var(--color-destructive)" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Mood" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <Card className="border border-border/80 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <SmilePlus className="w-5 h-5 text-primary" />
                Mood Tracker Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Bagaimana perasaan Anda hari ini? Mencatat mood secara rutin membantu AI menganalisis pola emosi yang memicu keinginan menonton konten pornografi.
              </p>
              <div className="flex justify-between gap-2 max-w-md mx-auto">
                {['😭', '😔', '😐', '🙂', '🤩'].map((emoji, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleMoodSelect(i)}
                    className={`text-3xl transition-all p-4 rounded-2xl flex-1 flex items-center justify-center ${
                      mood === i 
                        ? 'bg-primary scale-105 shadow-md shadow-primary/20 text-foreground' 
                        : 'bg-secondary/40 hover:bg-secondary hover:opacity-100 opacity-80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
