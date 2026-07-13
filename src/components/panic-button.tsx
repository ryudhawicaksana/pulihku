"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Wind, Activity, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export function PanicButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initial" | "breathe" | "options">("initial");

  const handleOpen = () => {
    setIsOpen(true);
    setStep("initial");
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
                    <p className="text-muted-foreground text-balance">
                      Godaan ini hanya sementara. Kamu lebih kuat dari yang kamu bayangkan.
                    </p>
                  </div>
                  
                  <div className="flex flex-col w-full gap-3 mt-4">
                    <Button 
                      size="lg" 
                      className="w-full text-base py-6 rounded-xl"
                      onClick={() => setStep("breathe")}
                    >
                      <Wind className="mr-2 w-5 h-5" /> Latihan Napas (1 Menit)
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full text-base py-6 rounded-xl border-2"
                      onClick={() => setStep("options")}
                    >
                      Lihat Opsi Lainnya
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "breathe" && (
                <motion.div
                  key="breathe"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Wind className="w-12 h-12 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-medium mt-8 text-center animate-pulse">
                    Tarik napas perlahan...
                  </h3>
                  <Button 
                    variant="ghost" 
                    className="mt-12 text-muted-foreground"
                    onClick={() => setStep("initial")}
                  >
                    Kembali
                  </Button>
                </motion.div>
              )}

              {step === "options" && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col space-y-4 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Opsi Pengalihan</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary" 
                      className="h-24 flex-col gap-2 rounded-2xl whitespace-normal text-center h-auto py-4"
                      onClick={() => {
                        toast.success("Mantap! Ayo lakukan 10x push-up sekarang.");
                        setIsOpen(false);
                      }}
                    >
                      <Activity className="w-6 h-6 text-primary" />
                      <span>Push-up 10x</span>
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="h-24 flex-col gap-2 rounded-2xl whitespace-normal text-center h-auto py-4"
                      onClick={() => {
                        toast.success("Bagus! Segera minum segelas air putih.");
                        setIsOpen(false);
                      }}
                    >
                      <Wind className="w-6 h-6 text-primary" />
                      <span>Minum Air</span>
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full py-6 rounded-xl border-2 mt-2" onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/ai';
                  }}>
                    <ShieldAlert className="mr-2 w-5 h-5" /> Hubungi AI Sahabat
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
