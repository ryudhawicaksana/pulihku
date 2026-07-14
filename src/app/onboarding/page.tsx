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
import { Logo } from "@/components/layout/logo";

export default function Onboarding() {
  const { login, signUpWithEmailPassword, signInWithEmailPassword, isAuthenticated } = useUser();
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [ageInput, setAgeInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [finishError, setFinishError] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim() || !ageInput.trim()) return;

    setIsSubmitting(true);
    setAuthError("");
    const age = parseInt(ageInput);
    if (isNaN(age) || age <= 0) {
      setAuthError("Masukkan umur yang valid.");
      setIsSubmitting(false);
      return;
    }

    const res = await signUpWithEmailPassword(email.trim(), password.trim(), fullName.trim(), age);
    setIsSubmitting(false);
    
    if (res.success) {
      setName(fullName.trim());
      setStep(1); // Mulai kuesioner onboarding
    } else {
      setAuthError(res.error || "Gagal melakukan pendaftaran.");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setAuthError("");
    const res = await signInWithEmailPassword(email.trim(), password.trim());
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || "Email atau password salah.");
    }
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

  const finishOnboarding = async () => {
    setIsFinishing(true);
    setFinishError("");
    const res = await login(name || "Pejuang", answers);
    setIsFinishing(false);
    if (res && !res.success) {
      setFinishError(res.error || "Gagal menyimpan program pemulihan.");
    }
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
              <div className="flex items-center justify-center mx-auto mb-8">
                <Logo className="text-5xl" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-center">Selamat Datang di Pulihku</h1>
              
              {!isAuthenticated ? (
                <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                  
                  {/* Tab Navigation */}
                  <div className="flex w-full justify-center border-b border-border mb-6">
                    <button 
                      type="button"
                      className={`flex-1 py-3 text-lg font-medium transition-colors border-b-2 ${activeTab === 'signup' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => { setActiveTab('signup'); setAuthError(''); }}
                    >
                      Daftar
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 py-3 text-lg font-medium transition-colors border-b-2 ${activeTab === 'login' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => { setActiveTab('login'); setAuthError(''); }}
                    >
                      Masuk
                    </button>
                  </div>

                  {activeTab === 'signup' ? (
                    <form onSubmit={handleSignUp} className="w-full space-y-4 text-left">
                      <p className="text-sm text-muted-foreground text-center mb-2">
                        Silakan buat akun baru untuk memulai program pemulihan.
                      </p>
                      
                      <div className="space-y-1">
                        <Label htmlFor="fullname">Nama Lengkap</Label>
                        <Input 
                          id="fullname"
                          type="text"
                          placeholder="Nama Lengkap Anda" 
                          className="h-12 rounded-xl w-full"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="age-input">Umur</Label>
                        <Input 
                          id="age-input"
                          type="number"
                          placeholder="Contoh: 22" 
                          className="h-12 rounded-xl w-full"
                          value={ageInput}
                          onChange={(e) => setAgeInput(e.target.value)}
                          required
                          disabled={isSubmitting}
                          min={1}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="nama@email.com" 
                          className="h-12 rounded-xl w-full"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password"
                          type="password"
                          placeholder="Minimal 6 karakter" 
                          className="h-12 rounded-xl w-full"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          minLength={6}
                        />
                      </div>

                      {authError && <p className="text-destructive text-sm font-semibold text-center">{authError}</p>}
                      
                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full rounded-full py-6 text-lg shadow-lg shadow-primary/20 mt-4" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Mendaftar..." : "Daftar & Mulai"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="w-full space-y-4 text-left">
                      <p className="text-sm text-muted-foreground text-center mb-2">
                        Masuk ke akun yang sudah terdaftar.
                      </p>
                      
                      <div className="space-y-1">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email"
                          type="email"
                          placeholder="nama@email.com" 
                          className="h-12 rounded-xl w-full"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="login-password">Password</Label>
                        <Input 
                          id="login-password"
                          type="password"
                          placeholder="Masukkan password Anda" 
                          className="h-12 rounded-xl w-full"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {authError && <p className="text-destructive text-sm font-semibold text-center">{authError}</p>}
                      
                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full rounded-full py-6 text-lg shadow-lg shadow-primary/20 mt-4" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Masuk..." : "Masuk"}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto text-center font-normal">
                    Email terverifikasi! Sekarang, tentukan nama panggilan atau julukan anonim Anda.
                  </p>
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

                  {finishError && (
                    <p className="text-destructive text-sm font-semibold text-center mb-4">{finishError}</p>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full rounded-xl py-6 text-lg shadow-xl shadow-primary/20" 
                    onClick={finishOnboarding}
                    disabled={isFinishing}
                  >
                    {isFinishing ? "Menyimpan Program..." : "Mulai Program Pemulihan"}
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
