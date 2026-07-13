"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Zap, SmilePlus, CalendarCheck, LogOut, CheckCircle2 } from "lucide-react";
import { PanicButton } from "@/components/panic-button";
import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useUser();
  const [challengeDone, setChallengeDone] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  
  // Hitung streak dari startDate
  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Halo, {user?.name || "Pejuang"}! <span className="text-4xl">{user?.avatar || "🌱"}</span></h1>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive" title="Keluar">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">Hari ini adalah hari yang hebat untuk terus bertumbuh.</p>
        </div>
        <div className="w-full md:w-auto">
          <PanicButton />
        </div>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 opacity-80" />
              <h3 className="font-medium opacity-90">Hari Bertumbuh</h3>
            </div>
            <p className="text-4xl font-bold">{streak} <span className="text-lg font-normal opacity-80">Hari</span></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-medium">Rekor Terpanjang</h3>
            </div>
            <p className="text-3xl font-bold">{streak > 0 ? streak : 0} <span className="text-base font-normal text-muted-foreground">Hari</span></p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Recovery Score</h3>
              </div>
              <span className="font-bold text-primary">{Math.min(100, streak * 5)}/100</span>
            </div>
            <Progress value={Math.min(100, streak * 5)} className="h-3" />
            <p className="text-sm text-muted-foreground mt-3">
              {streak === 0 
                ? "Mari mulai membangun pondasi pemulihanmu hari ini!" 
                : "Tingkat pemulihanmu semakin membaik!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Challenge */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Tantangan Harian</CardTitle>
              <p className="text-sm text-muted-foreground">Selesaikan untuk +50 XP</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">Membaca 15 Menit</h4>
                <p className="text-muted-foreground">Alihkan pikiranmu dengan membaca buku non-fiksi yang memotivasi.</p>
              </div>
              <Button 
                variant={challengeDone ? "secondary" : "default"}
                disabled={challengeDone}
                onClick={() => {
                  setChallengeDone(true);
                  toast.success("Hebat! Tantangan selesai. +50 XP");
                }}
              >
                {challengeDone ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Selesai
                  </>
                ) : "Selesai"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-primary" />
              Mood Hari Ini
            </CardTitle>
            <Badge variant={mood !== null ? "default" : "outline"} className={mood === null ? "bg-secondary" : ""}>
              {mood !== null ? "Tercatat" : "Belum Diisi"}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">Bagaimana perasaanmu hari ini? Catat untuk AI analisis.</p>
            <div className="flex justify-between">
              {['😭', '😔', '😐', '🙂', '🤩'].map((emoji, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    setMood(i);
                    toast.success("Terima kasih! Mood harian Anda telah dicatat.");
                  }}
                  className={`text-3xl transition-transform p-2 rounded-full ${
                    mood === i 
                      ? 'scale-125 bg-primary/20 ring-2 ring-primary' 
                      : 'hover:scale-125 hover:bg-secondary opacity-70 hover:opacity-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quote */}
      <Card className="bg-secondary/50 border-none">
        <CardContent className="p-8 text-center">
          <p className="text-xl italic text-muted-foreground">
            "Kekuatan sejati bukanlah tidak pernah jatuh, melainkan selalu bangkit setiap kali kita jatuh."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
