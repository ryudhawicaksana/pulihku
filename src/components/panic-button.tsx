"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Wind, Activity, Heart, X, 
  ShowerHead, PenTool, Music, Footprints, Droplets 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from "@/components/user-provider";
import { supabase } from "@/lib/supabase";

export function PanicButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initial" | "breathe" | "options">("initial");
  const { user, addXp } = useUser();

  // Breathing states
  const [breathSeconds, setBreathSeconds] = useState(60);
  const [breathPhase, setBreathPhase] = useState<"Tarik Napas" | "Tahan Napas" | "Hembuskan Napas">("Tarik Napas");
  const [phaseTimer, setPhaseTimer] = useState(4); // 4-4-4 Box breathing pattern

  const handleOpen = () => {
    setIsOpen(true);
    setStep("initial");
    setBreathSeconds(60);
    setBreathPhase("Tarik Napas");
    setPhaseTimer(4);
  };

  const logSosAction = async (actionName: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("users_sos_logs")
        .insert({
          user_id: user.id,
          action_taken: actionName
        });
      if (error) console.error("Error logging SOS action to Supabase:", error);
    } catch (err) {
      console.error("Gagal mencatat log SOS:", err);
    }
  };

  // Timer effect for 60 seconds breathing exercise
  useEffect(() => {
    if (step !== "breathe" || !isOpen) return;

    // 60-second countdown
    const globalTimer = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(globalTimer);
          setIsOpen(false);
          toast.success("Hebat! Anda berhasil melewati godaan kritikal. +25 XP!");
          addXp(25);
          logSosAction("Latihan Pernapasan 1 Menit");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(globalTimer);
  }, [step, isOpen, addXp, user]);

  // Phase animation timer (4s Tarik, 4s Tahan, 4s Hembuskan)
  useEffect(() => {
    if (step !== "breathe" || !isOpen) return;

    const phaseInterval = setInterval(() => {
      setPhaseTimer((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          setBreathPhase((currentPhase) => {
            if (currentPhase === "Tarik Napas") return "Tahan Napas";
            if (currentPhase === "Tahan Napas") return "Hembuskan Napas";
            return "Tarik Napas";
          });
          return 4; // Reset phase timer to 4s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(phaseInterval);
  }, [step, isOpen]);

  const handleOptionSelect = (optionName: string, xpReward: number) => {
    toast.success(`Bagus! Lakukan: ${optionName}. +${xpReward} XP!`);
    addXp(xpReward);
    logSosAction(optionName);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="destructive"
        className="w-full py-8 text-lg font-bold shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all group rounded-2xl"
      >
        <ShieldAlert className="mr-2 w-6 h-6 group-hover:animate-pulse" />
        Saya Sedang Mengalami Godaan
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl bg-card p-0 overflow-hidden">
          <div className="p-6">
            <DialogTitle className="sr-only">Bantuan Darurat</DialogTitle>
            <DialogDescription className="sr-only">Pilih tindakan untuk mengalihkan godaan.</DialogDescription>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Initial Prompt */}
              {step === "initial" && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center text-center space-y-6 py-6"
                >
                  <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-10 h-10 text-destructive animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Bernapaslah...</h2>
                    <p className="text-muted-foreground text-sm text-balance">
                      Godaan ini hanya dorongan sementara di otak. Kamu lebih kuat dari godaan ini.
                    </p>
                  </div>
                  
                  <div className="flex flex-col w-full gap-3 mt-4">
                    <Button 
                      size="lg" 
                      className="w-full text-sm py-6 rounded-xl font-bold bg-primary text-foreground hover:bg-primary/95"
                      onClick={() => setStep("breathe")}
                    >
                      <Wind className="mr-2 w-5 h-5" /> Latihan Napas Relaksasi (1 Menit)
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full text-sm py-6 rounded-xl border-2 font-semibold"
                      onClick={() => setStep("options")}
                    >
                      Lihat Opsi Lainnya
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Animated Breathing Exercise */}
              {step === "breathe" && (
                <motion.div
                  key="breathe"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  {/* Global countdown progress */}
                  <Badge variant="outline" className="mb-8 bg-secondary font-bold text-xs">
                    {breathSeconds} Detik Tersisa
                  </Badge>

                  {/* Expanding/Shrinking Breathing Circle Indicator */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: breathPhase === "Tarik Napas" 
                          ? 1.4 
                          : breathPhase === "Tahan Napas" 
                          ? 1.4 
                          : 0.9,
                      }}
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full bg-primary/20"
                    />
                    <motion.div
                      animate={{ 
                        scale: breathPhase === "Tarik Napas" 
                          ? 1.25 
                          : breathPhase === "Tahan Napas" 
                          ? 1.25 
                          : 0.95,
                      }}
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut"
                      }}
                      className="absolute w-36 h-36 rounded-full bg-primary/45"
                    />
                    <div className="z-10 bg-card w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border border-primary/20">
                      <Wind className="w-8 h-8 text-foreground animate-bounce" />
                      <span className="text-xs font-black text-foreground mt-1">{phaseTimer}s</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mt-8 text-foreground min-h-[40px]">
                    {breathPhase}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                    {breathPhase === "Tarik Napas" && "Hirup udara segar perlahan lewat hidung..."}
                    {breathPhase === "Tahan Napas" && "Tahan napas Anda, rasakan ketenangan..."}
                    {breathPhase === "Hembuskan Napas" && "Keluarkan udara perlahan dari mulut..."}
                  </p>

                  <Button 
                    variant="ghost" 
                    className="mt-8 text-xs text-muted-foreground hover:bg-secondary rounded-xl"
                    onClick={() => setStep("initial")}
                  >
                    Batal
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Diverse Alternative Options */}
              {step === "options" && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col space-y-4 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-lg font-bold">Opsi Pengalihan Instan</h2>
                      <p className="text-xs text-muted-foreground">Pilih aktivitas produktif untuk meredam hasrat.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 hide-scrollbar">
                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Push-up 10 Kali", 10)}
                    >
                      <Activity className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Push-up 10x</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+10 XP</Badge>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Minum Air Segelas", 5)}
                    >
                      <Droplets className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Minum Air</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+5 XP</Badge>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Jalan Kaki 5 Menit", 10)}
                    >
                      <Footprints className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Jalan 5 Menit</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+10 XP</Badge>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Mandi Air Dingin", 15)}
                    >
                      <ShowerHead className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Mandi Dingin</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+15 XP</Badge>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Menulis Jurnal Pemulihan", 15)}
                    >
                      <PenTool className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Tulis Jurnal</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+15 XP</Badge>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="flex-col gap-2 rounded-2xl p-4 h-auto text-center border hover:border-primary/50"
                      onClick={() => handleOptionSelect("Mendengar Musik Relaksasi", 5)}
                    >
                      <Music className="w-5 h-5 text-foreground" />
                      <div className="text-xs font-bold">Dengar Musik</div>
                      <Badge className="bg-primary/20 text-[10px] text-foreground font-black px-1.5 py-0">+5 XP</Badge>
                    </Button>
                  </div>

                  <Button 
                    className="w-full py-6 rounded-xl bg-primary text-foreground hover:bg-primary/90 mt-2 font-bold text-sm" 
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = '/ai';
                    }}
                  >
                    <ShieldAlert className="mr-2 w-5 h-5" /> Hubungi AI Sahabat (Curhat Instan)
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
