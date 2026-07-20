const pptxgen = require("pptxgenjs");

const slidesData = [
  {
    category: "PULIHKU",
    title: "🌱 Pulihku - Sahabat Pemulihan Digital Anda",
    subtitle: "Asisten Rehabilitasi Mandiri Berbasis Neurosains untuk Mengatasi Kecanduan Pornografi",
    points: [
      { text: "Membantu individu memulihkan diri dengan pendekatan holistik yang mengedukasi dan membangun kebiasaan dopamin baru.", boldText: "Pendekatan Neurosains:" },
      { text: "Jejak Pulih (Tracker), AI Sahabat Pulih (Grounding Chat), Panic Button (Box Breathing 4-4-4), Akademi Pulih (Edu), Toko XP, Komunitas Anonim, & Safe Browse.", boldText: "Fitur Utama:" },
      { text: "Teknologi modern Next.js 14+, Supabase DB & Auth (RLS), Tailwind CSS, Framer Motion, dan Progressive Web App (PWA) lengkap.", boldText: "Arsitektur Premium:" }
    ],
    bgPptHex: "064E3B",
    accentColorHex: "10B981"
  },
  {
    category: "Kategori I: Pola Pikir & Kerangka Kerja Konseptual (Conceptual Layer)",
    title: "1. Cubical Logic Model (CLM)",
    subtitle: "Kerangka Berpikir Multidimensi untuk Merancang, Memetakan, dan Mengevaluasi Sistem Secara Menyeluruh",
    points: [
      { text: "Tahap perumusan konsep teoretis, visi strategis, kebutuhan fungsional, dan desain arsitektur tingkat tinggi.", boldText: "Abstract (A / Konseptual):" },
      { text: "Mewujudkan konsep menjadi bentuk nyata, seperti kode program, infrastruktur fisik, sistem berjalan, atau perangkat keras.", boldText: "Concrete (C / Implementasi):" },
      { text: "Menyeimbangkan aspek konsep teoretis dengan realitas implementasi melalui evaluasi berkala, pengujian sistem, dan penyempurnaan.", boldText: "Balance (B / Validasi):" }
    ],
    bgPptHex: "1E3A8A",
    accentColorHex: "3B82F6"
  },
  {
    category: "Kategori I: Pola Pikir & Kerangka Kerja Konseptual (Conceptual Layer)",
    title: "2. Antigravity & Conversational Coding",
    subtitle: "Paradigma Pengembangan Modern yang Memposisikan AI Sebagai Mitra Kolaboratif (Pair Programmer)",
    points: [
      { text: "Developer merumuskan kebutuhan bisnis, logika sistem, dan arsitektur aplikasi menggunakan bahasa alami terstruktur.", boldText: "Commander (Developer):" },
      { text: "AI bertindak menerjemahkan instruksi menjadi kode program berkualitas, melakukan debugging, refactoring, dan dokumentasi.", boldText: "Executor (AI):" },
      { text: "Integrasi mendalam pada Antigravity IDE mempercepat siklus pengembangan dan meminimalkan beban kognitif developer.", boldText: "Antigravity IDE:" }
    ],
    bgPptHex: "312E81",
    accentColorHex: "6366F1"
  },
  {
    category: "Kategori II: Metodologi Kerja (Methodology Layer)",
    title: "3. BMAD Method (Agile AI-Driven Development)",
    subtitle: "Breakthrough Method of Agile AI-Driven Development untuk Optimasi Multi-Agent AI",
    points: [
      { text: "Membagi siklus pengembangan ke dalam beberapa Agen AI terspesialisasi dengan peran fungsional terarah.", boldText: "Multi-Agent AI Ecosystem:" },
      { text: "Memisahkan tugas untuk Analis Bisnis, Arsitek Sistem, Pengembang/Developer, dan QA secara modular.", boldText: "Peran Terspesialisasi:" },
      { text: "Meningkatkan efisiensi, akurasi, dan skalabilitas pengerjaan proyek kompleks berskala besar.", boldText: "Dampak Efisiensi:" }
    ],
    bgPptHex: "4C1D95",
    accentColorHex: "8B5CF6"
  },
  {
    category: "Kategori III: Rekayasa & Optimasi AI (AI Engineering Layer)",
    title: "4. AI Optimization: Fine-Tuning & RAG",
    subtitle: "Dua Strategi Utama Meningkatkan Performa dan Relevansi Model AI",
    points: [
      { text: "Fokus pada penyesuaian bobot internal model (weight parameters) menggunakan dataset spesifik melalui alur kerja modern (Unsloth, LoRA, SFT), disusul kuantisasi (GGUF/Hugging Face).", boldText: "Fine-Tuning:" },
      { text: "Mengintegrasikan basis data eksternal (knowledge base) secara dinamis agar AI mengambil konteks terkini sebelum memformulasi jawaban.", boldText: "RAG (Retrieval-Augmented Generation):" },
      { text: "Respons akurat tanpa perlu melatih ulang model dasar secara penuh, menghemat daya komputasi.", boldText: "Keunggulan RAG:" }
    ],
    bgPptHex: "701A75",
    accentColorHex: "D946EF"
  },
  {
    category: "Kategori III: Rekayasa & Optimasi AI (AI Engineering Layer)",
    title: "5. OpenCode & Private LLM (GLM-5.2)",
    subtitle: "Lingkungan Pengembangan (IDE/TUI) dengan Keamanan Maksimal dan Token Tanpa Batas",
    points: [
      { text: "Lingkungan pengembangan terintegrasi penuh dengan model bahasa besar (LLM) versi GLM-5.2 khusus.", boldText: "OpenCode TUI/IDE:" },
      { text: "Dihosting di infrastruktur server privat berlokasi di Toba, memberikan akses penggunaan token tanpa batas (unlimited tokens).", boldText: "Infrastruktur Toba Server:" },
      { text: "Data kode tetap berada di dalam infrastruktur server lokal, namun pengguna tetap memerlukan koneksi internet untuk mengaksesnya.", boldText: "Keamanan & Konektivitas:" }
    ],
    bgPptHex: "881337",
    accentColorHex: "F43F5E"
  },
  {
    category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
    title: "6. Version Control System (Git & GitHub)",
    subtitle: "Sistem Pengontrol Versi Terdistribusi Standar Industri",
    points: [
      { text: "Melacak riwayat perubahan kode sumber secara mendetail, aman, dan dapat diputar kembali (rollback) kapan saja.", boldText: "Version Control terdistribusi:" },
      { text: "Mengelola percabangan fitur (branching), melakukan peninjauan kode (pull requests), dan kolaborasi terstruktur.", boldText: "GitHub Integration:" },
      { text: "Meminimalkan konflik penggabungan kode (merge conflicts) serta membuat Software Development Life Cycle (SDLC) lebih teratur.", boldText: "Efisiensi Tim:" }
    ],
    bgPptHex: "083344",
    accentColorHex: "06B6D4"
  },
  {
    category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
    title: "7. AI Skills & Browser Automation (Playwright)",
    subtitle: "Ekstensibilitas Agen AI Melalui Instruksi, Alat, dan Otomatisasi Peramban",
    points: [
      { text: "Modul yang memperluas fungsionalitas dan kapabilitas agen AI melalui kombinasi instruksi sistem dan alur kerja terstruktur.", boldText: "AI Skills:" },
      { text: "Otomatisasi peramban (browser automation) yang memungkinkan AI berinteraksi langsung dengan halaman web.", boldText: "Playwright Integration:" },
      { text: "Pengujian antarmuka otomatis (end-to-end testing), ekstraksi data web (web scraping), dan simulasi aktivitas pengguna secara dinamis.", boldText: "Fungsi Utama:" }
    ],
    bgPptHex: "0C4A6E",
    accentColorHex: "0EA5E9"
  },
  {
    category: "Kategori IV: Alat Pengembangan & Distribusi (Development & Tooling Layer)",
    title: "8. Cloud Deployment & CI/CD (Netlify)",
    subtitle: "Platform Deployment Instan dan Otomatis Berbasis Serverless",
    points: [
      { text: "Platform cloud modern untuk deployment dan hosting aplikasi web berbasis arsitektur serverless atau Jamstack.", boldText: "Netlify Hosting:" },
      { text: "Setiap pembaruan (push) pada repositori Git memicu proses pembangunan (build) dan pengujian otomatis.", boldText: "Alur Kerja CI/CD otomatis:" },
      { text: "Aplikasi dipublikasikan ke jaringan global (Edge network) secara instan, aman, dan berkinerja tinggi.", boldText: "Global Edge Network:" }
    ],
    bgPptHex: "042F2E",
    accentColorHex: "14B8A6"
  },
  {
    category: "Kategori V: Infrastruktur Fisik & Jaringan (Infrastructure & Network Layer)",
    title: "9. Internet of Things (IoT) & Hardware Architecture",
    subtitle: "Integrasi Perangkat Keras Fisik dengan Sistem Digital",
    points: [
      { text: "Merancang arsitektur perangkat keras sejak tahap awal, memilih mikrokontroler/mikroprosesor yang tepat.", boldText: "Hardware Design:" },
      { text: "Integrasi sensor untuk membaca data lingkungan dan aktuator untuk melakukan tindakan fisik.", boldText: "Sensor & Aktuator:" },
      { text: "Menggunakan protokol ringan seperti MQTT, HTTP, atau CoAP dengan enkripsi ujung-ke-ujung (end-to-end).", boldText: "Komunikasi & Keamanan:" }
    ],
    bgPptHex: "451A03",
    accentColorHex: "F59E0B"
  },
  {
    category: "Kategori V: Infrastruktur Fisik & Jaringan (Infrastructure & Network Layer)",
    title: "10. VPN Overlay & Peer-to-Peer Mesh (NetBird)",
    subtitle: "Jaringan Privat Terenkripsi Menghubungkan Antar Perangkat Secara Langsung",
    points: [
      { text: "Membangun jaringan privat virtual terenkripsi yang menghubungkan berbagai perangkat secara peer-to-peer.", boldText: "VPN Overlay NetBird:" },
      { text: "Arsitektur mesh overlay berbasis protokol WireGuard yang cepat, ringan, dan aman.", boldText: "WireGuard Mesh:" },
      { text: "Seluruh node berkomunikasi seolah berada di satu jaringan lokal (LAN), mengeliminasi firewall & port forwarding.", boldText: "Bebas Kompleksitas:" }
    ],
    bgPptHex: "431407",
    accentColorHex: "F97316"
  }
];

function generate() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";

  slidesData.forEach((slide) => {
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

  pptx.writeFile({ fileName: "Presentasi_Slide_Pulihku.pptx" })
    .then(fileName => {
      console.log(`Presentasi berhasil dibuat: ${fileName}`);
    })
    .catch(err => {
      console.error("Gagal membuat presentasi:", err);
    });
}

generate();
