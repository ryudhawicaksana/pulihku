"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { HeartHandshake, Leaf, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useUser } from "@/components/user-provider";

export default function Onboarding() {
  const { login, signInWithGoogle, isGoogleAuthenticated } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const questions = [
    {
      id: "age",
      title: "Di rentang usia berapa Anda saat ini?",
      subtitle: "Ini membantu kami menyesuaikan gaya komunikasi AI.",
      type: "radio",
      options: [
        { value: "under18", label: "Di bawah 18 tahun" },
        { value: "18-24", label: "18 - 24 tahun" },
        { value: "25-34", label: "25 - 34 tahun" },
        { value: "35plus", label: "35 tahun ke atas" },
      ]
    },
    {
      id: "frequency",
      title: "Mari mulai dengan jujur. Seberapa sering Anda mengonsumsi konten pornografi saat ini?",
      type: "radio",
      options: [
        { value: "daily", label: "Setiap hari (Kompulsif)" },
        { value: "weekly", label: "Beberapa kali seminggu" },
        { value: "monthly", label: "Beberapa kali sebulan" },
        { value: "rarely", label: "Jarang, tapi ingin berhenti total" },
      ]
    },
    {
      id: "trigger",
      title: "Kapan godaan untuk menonton biasanya muncul?",
      subtitle: "Pilih semua yang relevan. Ini membantu kami membuat program pencegahan.",
      type: "checkbox",
      options: [
        { value: "stress", label: "Saat sedang stres atau banyak beban pikiran" },
        { value: "lonely", label: "Saat merasa kesepian atau butuh koneksi" },
        { value: "bored", label: "Saat bosan tidak ada kegiatan" },
        { value: "bedtime", label: "Malam hari sebelum tidur" },
        { value: "morning", label: "Pagi hari saat bangun tidur" },
      ]
    },
    {
      id: "feeling",
      title: "Bagaimana perasaan Anda setelah mengonsumsinya?",
      type: "radio",
      options: [
        { value: "guilt", label: "Rasa bersalah yang mendalam dan malu" },
        { value: "tired", label: "Lelah, tidak termotivasi, *brain fog*" },
        { value: "numb", label: "Mati rasa atau biasa saja" },
      ]
    },
    {
      id: "history",
      title: "Apakah Anda pernah mencoba berhenti sebelumnya?",
      type: "radio",
      options: [
        { value: "first_time", label: "Belum pernah, ini percobaan pertama saya" },
        { value: "tried_failed", label: "Pernah, tapi selalu kembali lagi (relapse)" },
        { value: "long_streak", label: "Pernah berhasil lama, lalu jatuh lagi" },
      ]
    },
    {
      id: "motivation",
      title: "Apa alasan terkuat Anda ingin pulih sekarang?",
      subtitle: "Pilih semua yang memotivasi Anda.",
      type: "checkbox",
      options: [
        { value: "mental", label: "Memperbaiki kesehatan mental (mengurangi kecemasan/depresi)" },
        { value: "productivity", label: "Mendapatkan kembali fokus dan energi untuk bekerja/belajar" },
        { value: "relationship", label: "Menyelamatkan atau memperbaiki hubungan dengan pasangan" },
        { value: "spiritual", label: "Alasan spiritual atau nilai moral" },
        { value: "self_esteem", label: "Meningkatkan kepercayaan diri" },
      ]
    }
  ];

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, value] };
      } else {
        return { ...prev, [questionId]: current.filter(item => item !== value) };
      }
    });
  };

  const handleNext = () => {
    if (step > 0 && step <= questions.length) {
      const q = questions[step - 1];
      if (q.type === "radio" && !answers[q.id]) {
        setAnswers(prev => ({ ...prev, [q.id]: q.options[0].value }));
      }
    }
    if (step <= questions.length) {
      setStep(step + 1);
    }
  };

  const finishOnboarding = () => {
    login(name || "Pejuang", answers);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Progress Bar */}
        {step > 0 && step <= questions.length && (
          <div className="w-full max-w-xl mx-auto bg-secondary h-2 rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="bg-primary h-full"
              initial={{ width: `${((step - 1) / questions.length) * 100}%` }}
              animate={{ width: `${(step / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
 
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 w-full max-w-xl mx-auto flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Leaf className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-center">Selamat Datang di Pulihku</h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto text-center font-normal">
                {!isGoogleAuthenticated 
                  ? "Mari masuk menggunakan akun Google Anda terlebih dahulu untuk memulai program pemulihan digital."
                  : "Akun Google terhubung! Sekarang, tentukan nama panggilan atau julukan anonim Anda."}
              </p>

              {!isGoogleAuthenticated ? (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg mt-8 border-2 flex items-center gap-3 hover:bg-secondary transition-all"
                  onClick={signInWithGoogle}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Masuk dengan Google
                </Button>
              ) : (
                <>
                  <div className="w-full max-w-sm mx-auto mt-6">
                    <Input 
                      placeholder="Masukkan nama Anda..." 
                      className="text-center text-lg h-14 rounded-full w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && name.trim()) handleNext();
                      }}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-lg mt-8 shadow-lg shadow-primary/20" 
                    onClick={handleNext}
                    disabled={!name.trim()}
                  >
                    Mulai Perjalanan Saya <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {step > 0 && step <= questions.length && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <Card className="border-none shadow-xl shadow-primary/5 text-left w-full mx-auto">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold mb-2">{questions[step - 1].title}</h2>
                  {questions[step - 1].subtitle && (
                    <p className="text-muted-foreground mb-6">{questions[step - 1].subtitle}</p>
                  )}
                  
                  <div className="mt-8 space-y-4">
                    {questions[step - 1].type === "radio" ? (
                      <RadioGroup 
                        value={(answers[questions[step - 1].id] as string) || questions[step - 1].options[0].value} 
                        onValueChange={(val) => handleRadioChange(questions[step - 1].id, val)}
                        className="space-y-3"
                      >
                        {questions[step - 1].options.map((opt) => (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className="flex items-center space-x-3 space-y-0 p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                          >
                            <RadioGroupItem value={opt.value} id={opt.value} />
                            <span className="text-base font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {questions[step - 1].options.map((opt) => (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className="flex items-center space-x-3 space-y-0 p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                          >
                            <Checkbox 
                              id={opt.value} 
                              checked={((answers[questions[step - 1].id] as string[]) || []).includes(opt.value)}
                              onCheckedChange={(checked) => handleCheckboxChange(questions[step - 1].id, opt.value, !!checked)}
                            />
                            <span className="text-base font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <Button size="lg" className="rounded-full px-8" onClick={handleNext}>
                      Lanjut <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step > questions.length && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full text-left"
            >
              <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-48 h-48 text-primary" />
                </div>
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                    <ShieldCheck className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Program Pemulihan Anda Telah Siap</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Berdasarkan jawaban Anda yang ekstensif, AI Sahabat Pulih kami telah menyusun rencana pemulihan yang sangat dipersonalisasi:
                  </p>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">1</div>
                      <div>
                        <strong className="block text-foreground">Pemetaan Pola & Usia</strong>
                        <span className="text-muted-foreground">Pendekatan komunikasi dan strategi disesuaikan secara dinamis dengan demografi dan pengalaman masa lalu Anda.</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">2</div>
                      <div>
                        <strong className="block text-foreground">Strategi Anti-Trigger Harian</strong>
                        <span className="text-muted-foreground">Kami menargetkan secara spesifik waktu dan kondisi yang paling sering memicu Anda untuk relapse.</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">3</div>
                      <div>
                        <strong className="block text-foreground">Pemeliharaan Motivasi Inti</strong>
                        <span className="text-muted-foreground">Mengingatkan Anda akan alasan terkuat Anda untuk berubah setiap kali Anda menekan Panic Button.</span>
                      </div>
                    </li>
                  </ul>

                  <Button size="lg" className="w-full rounded-xl py-6 text-lg shadow-xl shadow-primary/20" onClick={finishOnboarding}>
                    Mulai Program Pemulihan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
