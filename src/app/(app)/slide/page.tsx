"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize, 
  Minimize, 
  Play, 
  Pause,
  Layers, 
  Code, 
  Workflow, 
  Cpu, 
  CpuIcon,
  Globe,
  Settings,
  FolderSync,
  Network,
  Compass
} from "lucide-react";
import pptxgen from "pptxgenjs";

// Definisi Slide
interface BulletPoint {
  text: string;
  boldText?: string;
}

interface Slide {
  id: number;
  category: string;
  icon: any;
  title: string;
  subtitle?: string;
  points: BulletPoint[];
  colorTheme: string; // Tailwind gradient classes
  bgPptHex: string;   // Hex color for PPT export background
  accentColorHex: string; // Accent text color for PPT export
}

export default function SlidePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: Slide[] = [
    {
      id: 0,
      category: "PULIHKU",
      icon: Compass,
      title: "🌱 Pulihku - Sahabat Pemulihan Digital Anda",
      subtitle: "Asisten Rehabilitasi Mandiri Berbasis Neurosains untuk Mengatasi Kecanduan Pornografi",
      points: [
        { text: "Membantu individu memulihkan diri dengan pendekatan holistik yang mengedukasi dan membangun kebiasaan dopamin baru.", boldText: "Pendekatan Neurosains:" },
        { text: "Jejak Pulih (Tracker), AI Sahabat Pulih (Grounding Chat), Panic Button (Box Breathing 4-4-4), Akademi Pulih (Edu), Toko XP, Komunitas Anonim, & Safe Browse.", boldText: "Fitur Utama:" },
        { text: "Teknologi modern Next.js 14+, Supabase DB & Auth (RLS), Tailwind CSS, Framer Motion, dan Progressive Web App (PWA) lengkap.", boldText: "Arsitektur Premium:" }
      ],
      colorTheme: "from-emerald-600 to-teal-500",
      bgPptHex: "064E3B",
      accentColorHex: "10B981"
    },
    {
      id: 1,
      category: "Kategori I: Pola Pikir & Kerangka Kerja Konseptual (Conceptual Layer)",
      icon: Layers,
      title: "1. Cubical Logic Model (CLM)",
      subtitle: "Kerangka Berpikir Multidimensi untuk Merancang, Memetakan, dan Mengevaluasi Sistem Secara Menyeluruh",
      points: [
        { text: "Tahap perumusan konsep teoretis, visi strategis, kebutuhan fungsional, dan desain arsitektur tingkat tinggi.", boldText: "Abstract (A / Konseptual):" },
        { text: "Mewujudkan konsep menjadi bentuk nyata, seperti kode program, infrastruktur fisik, sistem berjalan, atau perangkat keras.", boldText: "Concrete (C / Implementasi):" },
        { text: "Menyeimbangkan aspek konsep teoretis dengan realitas implementasi melalui evaluasi berkala, pengujian sistem, dan penyempurnaan.", boldText: "Balance (B / Validasi):" }
      ],
      colorTheme: "from-blue-600 to-indigo-500",
      bgPptHex: "1E3A8A",
      accentColorHex: "3B82F6"
    },
    {
      id: 2,
      category: "Kategori I: Pola Pikir & Kerangka Kerja Konseptual (Conceptual Layer)",
      icon: Code,
      title: "2. Antigravity & Conversational Coding",
      subtitle: "Paradigma Pengembangan Modern yang Memposisikan AI Sebagai Mitra Kolaboratif (Pair Programmer)",
      points: [
        { text: "Developer merumuskan kebutuhan bisnis, logika sistem, dan arsitektur aplikasi menggunakan bahasa alami terstruktur.", boldText: "Commander (Developer):" },
        { text: "AI bertindak menerjemahkan instruksi menjadi kode program berkualitas, melakukan debugging, refactoring, dan dokumentasi.", boldText: "Executor (AI):" },
        { text: "Integrasi mendalam pada Antigravity IDE mempercepat siklus pengembangan dan meminimalkan beban kognitif developer.", boldText: "Antigravity IDE:" }
      ],
      colorTheme: "from-indigo-600 to-violet-500",
      bgPptHex: "312E81",
      accentColorHex: "6366F1"
    },
    {
      id: 3,
      category: "Kategori II: Metodologi Kerja (Methodology Layer)",
      icon: Workflow,
      title: "3. BMAD Method (Agile AI-Driven Development)",
      subtitle: "Breakthrough Method of Agile AI-Driven Development untuk Optimasi Multi-Agent AI",
      points: [
        { text: "Membagi siklus pengembangan ke dalam beberapa Agen AI terspesialisasi dengan peran fungsional terarah.", boldText: "Multi-Agent AI Ecosystem:" },
        { text: "Memisahkan tugas untuk Analis Bisnis, Arsitek Sistem, Pengembang/Developer, dan QA secara modular.", boldText: "Peran Terspesialisasi:" },
        { text: "Meningkatkan efisiensi, akurasi, dan skalabilitas pengerjaan proyek kompleks berskala besar.", boldText: "Dampak Efisiensi:" }
      ],
      colorTheme: "from-violet-600 to-fuchsia-500",
      bgPptHex: "4C1D95",
      accentColorHex: "8B5CF6"
    },
    {
      id: 4,
      category: "Kategori III: Rekayasa & Optimasi AI (AI Engineering Layer)",
      icon: Cpu,
      title: "4. AI Optimization: Fine-Tuning & RAG",
      subtitle: "Dua Strategi Utama Meningkatkan Performa dan Relevansi Model AI",
      points: [
        { text: "Fokus pada penyesuaian bobot internal model (weight parameters) menggunakan dataset spesifik melalui alur kerja modern (Unsloth, LoRA, SFT), disusul kuantisasi (GGUF/Hugging Face).", boldText: "Fine-Tuning:" },
        { text: "Mengintegrasikan basis data eksternal (knowledge base) secara dinamis agar AI mengambil konteks terkini sebelum memformulasi jawaban.", boldText: "RAG (Retrieval-Augmented Generation):" },
        { text: "Respons akurat tanpa perlu melatih ulang model dasar secara penuh, menghemat daya komputasi.", boldText: "Keunggulan RAG:" }
      ],
      colorTheme: "from-fuchsia-600 to-pink-500",
      bgPptHex: "701A75",
      accentColorHex: "D946EF"
    },
    {
      id: 5,
      category: "Kategori III: Rekayasa & Optimasi AI (AI Engineering Layer)",
      icon: CpuIcon,
      title: "5. OpenCode & Private LLM (GLM-5.2)",
      subtitle: "Lingkungan Pengembangan (IDE/TUI) dengan Keamanan Maksimal dan Token Tanpa Batas",
      points: [
        { text: "Lingkungan pengembangan terintegrasi penuh dengan model bahasa besar (LLM) versi GLM-5.2 khusus.", boldText: "OpenCode TUI/IDE:" },
        { text: "Dihosting di infrastruktur server privat berlokasi di Toba, memberikan akses penggunaan token tanpa batas (unlimited tokens).", boldText: "Infrastruktur Toba Server:" },
        { text: "Data kode tetap berada di dalam infrastruktur server lokal, namun pengguna tetap memerlukan koneksi internet untuk mengaksesnya.", boldText: "Keamanan & Konektivitas:" }
      ],
      colorTheme: "from-pink-600 to-rose-500",
      bgPptHex: "881337",
      accentColorHex: "F43F5E"
    },
    {
      id: 6,
      category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
      icon: Settings,
      title: "6. Version Control System (Git & GitHub)",
      subtitle: "Sistem Pengontrol Versi Terdistribusi Standar Industri",
      points: [
        { text: "Melacak riwayat perubahan kode sumber secara mendetail, aman, dan dapat diputar kembali (rollback) kapan saja.", boldText: "Version Control terdistribusi:" },
        { text: "Mengelola percabangan fitur (branching), melakukan peninjauan kode (pull requests), dan kolaborasi terstruktur.", boldText: "GitHub Integration:" },
        { text: "Meminimalkan konflik penggabungan kode (merge conflicts) serta membuat Software Development Life Cycle (SDLC) lebih teratur.", boldText: "Efisiensi Tim:" }
      ],
      colorTheme: "from-cyan-600 to-blue-500",
      bgPptHex: "083344",
      accentColorHex: "06B6D4"
    },
    {
      id: 7,
      category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
      icon: FolderSync,
      title: "7. AI Skills & Browser Automation (Playwright)",
      subtitle: "Ekstensibilitas Agen AI Melalui Instruksi, Alat, dan Otomatisasi Peramban",
      points: [
        { text: "Modul yang memperluas fungsionalitas dan kapabilitas agen AI melalui kombinasi instruksi sistem dan alur kerja terstruktur.", boldText: "AI Skills:" },
        { text: "Otomatisasi peramban (browser automation) yang memungkinkan AI berinteraksi langsung dengan halaman web.", boldText: "Playwright Integration:" },
        { text: "Pengujian antarmuka otomatis (end-to-end testing), ekstraksi data web (web scraping), dan simulasi aktivitas pengguna secara dinamis.", boldText: "Fungsi Utama:" }
      ],
      colorTheme: "from-sky-600 to-cyan-500",
      bgPptHex: "0C4A6E",
      accentColorHex: "0EA5E9"
    },
    {
      id: 8,
      category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
      icon: Globe,
      title: "8. Cloud Deployment & CI/CD (Netlify)",
      subtitle: "Platform Deployment Instan dan Otomatis Berbasis Serverless",
      points: [
        { text: "Platform cloud modern untuk deployment dan hosting aplikasi web berbasis arsitektur serverless atau Jamstack.", boldText: "Netlify Hosting:" },
        { text: "Setiap pembaruan (push) pada repositori Git memicu proses pembangunan (build) dan pengujian otomatis.", boldText: "Alur Kerja CI/CD otomatis:" },
        { text: "Aplikasi dipublikasikan ke jaringan global (Edge network) secara instan, aman, dan berkinerja tinggi.", boldText: "Global Edge Network:" }
      ],
      colorTheme: "from-teal-600 to-emerald-500",
      bgPptHex: "042F2E",
      accentColorHex: "14B8A6"
    },
    {
      id: 9,
      category: "Kategori V: Infrastruktur Fisik & Jaringan (Infrastructure & Network Layer)",
      icon: Network,
      title: "9. Internet of Things (IoT) & Hardware Architecture",
      subtitle: "Integrasi Perangkat Keras Fisik dengan Sistem Digital",
      points: [
        { text: "Merancang arsitektur perangkat keras sejak tahap awal, memilih mikrokontroler/mikroprosesor yang tepat.", boldText: "Hardware Design:" },
        { text: "Integrasi sensor untuk membaca data lingkungan dan aktuator untuk melakukan tindakan fisik.", boldText: "Sensor & Aktuator:" },
        { text: "Menggunakan protokol ringan seperti MQTT, HTTP, atau CoAP dengan enkripsi ujung-ke-ujung (end-to-end).", boldText: "Komunikasi & Keamanan:" }
      ],
      colorTheme: "from-amber-600 to-orange-500",
      bgPptHex: "451A03",
      accentColorHex: "F59E0B"
    },
    {
      id: 10,
      category: "Kategori V: Infrastruktur Fisik & Jaringan (Infrastructure & Network Layer)",
      icon: Globe,
      title: "10. VPN Overlay & Peer-to-Peer Mesh (NetBird)",
      subtitle: "Jaringan Privat Terenkripsi Menghubungkan Antar Perangkat Secara Langsung",
      points: [
        { text: "Membangun jaringan privat virtual terenkripsi yang menghubungkan berbagai perangkat secara peer-to-peer.", boldText: "VPN Overlay NetBird:" },
        { text: "Arsitektur mesh overlay berbasis protokol WireGuard yang cepat, ringan, dan aman.", boldText: "WireGuard Mesh:" },
        { text: "Seluruh node berkomunikasi seolah berada di satu jaringan lokal (LAN), mengeliminasi firewall & port forwarding.", boldText: "Bebas Kompleksitas:" }
      ],
      colorTheme: "from-orange-600 to-red-500",
      bgPptHex: "431407",
      accentColorHex: "F97316"
    }
  ];

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById("slide-container");
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Export to PowerPoint (.pptx)
  const exportToPPTX = () => {
    const pptx = new pptxgen();
    pptx.layout = "LAYOUT_16x9";

    slides.forEach((slide) => {
      const pptSlide = pptx.addSlide();
      
      // Set background color
      pptSlide.background = { fill: slide.bgPptHex };

      // Category Header
      pptSlide.addText(slide.category.toUpperCase(), {
        x: 0.8,
        y: 0.5,
        w: 11.5,
        h: 0.4,
        fontSize: 12,
        color: "D1D5DB",
        bold: true,
        fontFace: "Arial"
      });

      // Title
      pptSlide.addText(slide.title, {
        x: 0.8,
        y: 0.9,
        w: 11.5,
        h: 0.8,
        fontSize: 28,
        color: "FFFFFF",
        bold: true,
        fontFace: "Arial"
      });

      // Subtitle
      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 0.8,
          y: 1.7,
          w: 11.5,
          h: 0.6,
          fontSize: 14,
          color: slide.accentColorHex,
          italic: true,
          fontFace: "Arial"
        });
      }

      // Add Bullet Points
      slide.points.forEach((point, pIndex) => {
        const yPos = 2.4 + (pIndex * 1.3);
        
        // Bold title of point
        if (point.boldText) {
          pptSlide.addText(point.boldText, {
            x: 0.8,
            y: yPos,
            w: 11.5,
            h: 0.35,
            fontSize: 16,
            color: "FFFFFF",
            bold: true,
            fontFace: "Arial"
          });
        }

        // Body of point
        pptSlide.addText(point.text, {
          x: 0.8,
          y: point.boldText ? yPos + 0.35 : yPos,
          w: 11.5,
          h: 0.7,
          fontSize: 14,
          color: "E5E7EB",
          fontFace: "Arial"
        });
      });

      // Footer
      pptSlide.addText("Pulihku - Sahabat Pemulihan Digital Anda", {
        x: 0.8,
        y: 6.8,
        w: 6,
        h: 0.3,
        fontSize: 10,
        color: "9CA3AF",
        fontFace: "Arial"
      });
    });

    pptx.writeFile({ fileName: "Presentasi_Slide_Pulihku.pptx" });
  };

  const activeSlide = slides[currentSlide];
  const SlideIcon = activeSlide.icon;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-2">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Presentasi Slide
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Gunakan mode interaktif di bawah atau unduh langsung file presentasi ke PowerPoint (.pptx).
          </p>
        </div>
        
        {/* Tombol Ekspor */}
        <button
          onClick={exportToPPTX}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-medium px-5 py-3 rounded-2xl transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95 cursor-pointer"
        >
          <Download className="w-5 h-5 animate-pulse" />
          <span>Unduh PowerPoint (.pptx)</span>
        </button>
      </div>

      {/* Main Slide Deck Container */}
      <div
        id="slide-container"
        className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 flex flex-col justify-between ${
          isFullscreen ? "p-8 md:p-16 h-screen w-screen rounded-none" : "p-6 md:p-10"
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        {/* Top Header of Slide */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${activeSlide.colorTheme} text-white`}>
              <SlideIcon className="w-6 h-6" />
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              {activeSlide.category}
            </span>
          </div>
          <div className="text-xs md:text-sm font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            Slide {currentSlide + 1} dari {slides.length}
          </div>
        </div>

        {/* Center Content of Slide */}
        <div className="flex-1 flex flex-col justify-center my-6 md:my-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 md:gap-6"
            >
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                  {activeSlide.title}
                </h2>
                {activeSlide.subtitle && (
                  <p className="text-sm md:text-lg text-emerald-400 font-medium italic mt-2">
                    {activeSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Bullet Points */}
              <div className="grid gap-3 md:gap-4 mt-2">
                {activeSlide.points.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      {point.boldText && (
                        <span className="font-bold text-white block md:inline md:mr-2">
                          {point.boldText}
                        </span>
                      )}
                      <span className="text-slate-300 text-sm md:text-base leading-relaxed">
                        {point.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Control Bar of Slide */}
        <div className="flex items-center justify-between z-10 border-t border-white/5 pt-4">
          {/* Brand/Footer */}
          <div className="text-xs md:text-sm font-medium text-slate-400 hidden sm:block">
            🌱 Pulihku
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors active:scale-95 cursor-pointer"
              title="Slide Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors active:scale-95 cursor-pointer"
              title={isPlaying ? "Jeda Putar Otomatis" : "Putar Otomatis (5 detik/slide)"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4" />}
              <span className="text-xs font-semibold hidden md:inline">
                {isPlaying ? "Jeda" : "Putar"}
              </span>
            </button>

            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors active:scale-95 cursor-pointer"
              title="Slide Selanjutnya (Panah Kanan)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Side Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors active:scale-95 cursor-pointer"
              title="Layar Penuh (Tombol F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Slide Navigation Dots / Quick Select */}
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              currentSlide === index 
                ? "bg-emerald-500 scale-125 shadow-md shadow-emerald-500/20" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
            title={`Pindah ke Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Petunjuk Pintasan */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          💡 <span className="font-semibold">Tips Pintasan Keyboard:</span> Gunakan <kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border">Panah Kiri</kbd> / <kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border">Panah Kanan</kbd> untuk berpindah slide, dan <kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border">F</kbd> untuk Layar Penuh.
        </div>
        <div>
          PowerPoint didukung oleh <span className="font-mono text-emerald-400">pptxgenjs</span>
        </div>
      </div>
    </div>
  );
}
