# 🌱 Pulihku - Sahabat Pemulihan Digital Anda

Pulihku adalah aplikasi web berbasis neurosains yang dirancang khusus untuk membantu individu memulihkan diri dari kecanduan pornografi. Tidak sekadar memblokir, Pulihku bertindak sebagai asisten rehabilitasi mandiri yang mengedukasi, mendukung secara psikologis, dan membangun kebiasaan (dopamin) yang baru.

---

## ✨ Fitur Utama

- **Jejak Pulih (Tracker):** Lacak *streak* keberhasilan Anda (dari Level Benih hingga Hutan Raksasa), hitung skor pemulihan (*Recovery Score*), dan lacak suasana hati harian Anda.
- **AI Sahabat Pulih:** *Chatbot* bertenaga AI yang siap mendengarkan keluh kesah Anda tanpa menghakimi, memandu Anda melakukan teknik *grounding* saat *trigger* menyerang, serta dilengkapi dengan pembersihan sesi obrolan yang aman per pengguna.
- **Panic Button (SOS) & Log Aktivitas:** Tombol darurat yang menyediakan panduan latihan pernapasan (menggunakan *Box Breathing Pattern* 4-4-4 selama 60 detik) beserta visualisasi interaktif. Setiap penggunaan dicatat secara otomatis ke database Supabase (`users_sos_logs`) untuk melacak riwayat pertolongan darurat.
- **Akademi Pulih (Pelacakan Progres):** Modul edukasi neurosains untuk memahami sains di balik kecanduan, dopamin, dan *urge surfing*. Progres membaca dan belajar Anda kini dicatat secara otomatis ke database (`user_academy_progress`) dengan hadiah XP setelah menyelesaikan modul.
- **Toko XP (XP Shop):** Gunakan akumulasi XP Anda untuk menukarkan item kebugaran mental:
  - **Perisai Pemulihan (Shield of Recovery):** Melindungi *streak* Anda saat terjadi relapse (maksimal menyimpan 3 perisai).
  - **Streak Freeze:** Mengamankan dan mempertahankan *streak* harian Anda.
  - **Avatar Premium:** Buka berbagai avatar eksklusif (seperti Singa Emas 🦁, Ksatria Pulih ⚔️, Raja Kediri 👑, dll.).
- **Sistem Level & Kunci Avatar Dinamis:** Terdiri dari 5 jenjang level avatar gratis yang terkunci secara dinamis berdasarkan pencapaian level Anda, ditambah dengan avatar bonus bebas (seperti 🕊️). Sistem akan secara otomatis mereset avatar aktif kembali ke dasar jika tingkat level Anda turun akibat relapse.
- **Komunitas Anonim & Realtime Leaderboard:** Ruang aman berbagi kemenangan dan saling menyemangati secara anonim. Papan peringkat kini berjalan secara realtime menggunakan `currentStreak` yang bersumber langsung dari Supabase sehingga otomatis terupdate secara dinamis ketika pengguna melakukan relapse atau reset.
- **Safe Browse (Ekstensi Browser):** Pemblokir tingkat jaringan berbasis *DeclarativeNetRequest* yang secara absolut menutup akses ke ratusan situs dewasa.
- **Progressive Web App (PWA):** Dukungan penuh PWA dengan file `manifest.json` dan aset ikon premium (192px & 512px) agar dapat diinstal langsung di perangkat Android, iOS, maupun Desktop layaknya aplikasi native.

---

## 🚀 Panduan Instalasi (Development)

Aplikasi ini dibangun menggunakan **Next.js (App Router)**, **TailwindCSS**, dan **shadcn/ui**.

1. Pastikan Anda telah menginstal [Node.js](https://nodejs.org/).
2. Unduh atau klon repositori ini.
3. Buka terminal dan masuk ke folder proyek:
   ```bash
   cd pulihku
   ```
4. Instal semua dependensi:
   ```bash
   npm install
   ```
5. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
6. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 🛡️ Cara Memasang Ekstensi "Pulihku Safe Browse"

Karena batasan keamanan browser modern, aplikasi web tidak bisa memblokir situs lain. Oleh karena itu, Pulihku dilengkapi dengan **Ekstensi Pendamping** untuk Google Chrome/Microsoft Edge.

1. Buka browser Chrome atau Edge Anda.
2. Ketikkan alamat ini di bilah navigasi: `chrome://extensions/`
3. Nyalakan **Developer mode** (Mode Pengembang) di pojok kanan atas layar.
4. Klik tombol **Load unpacked**.
5. Pilih folder bernama `pulihku-extension` yang ada di dalam proyek ini.
6. Selesai! Ekstensi kini aktif dan akan secara otomatis memblokir situs-situs porno dan pemicu visual lainnya.

---

## 🛠️ Teknologi & Layanan yang Digunakan

- **Framework:** Next.js 14+ (App Router)
- **Database & Auth:** Supabase (dengan RLS/Row Level Security yang aman serta sinkronisasi dinamis jumlah likes & comments via Database Trigger)
- **Styling:** Tailwind CSS & shadcn/ui
- **Animasi:** Framer Motion
- **Analitik:** Integrasi PostHog untuk pelacakan interaksi & telemetri pengguna
- **Layanan Email:** Kerangka integrasi Resend Email API untuk notifikasi pemulihan
- **Ikon:** Lucide React
- **Manajemen Tanggal:** date-fns

---

*Dibuat untuk membantu siapa pun yang ingin merdeka dan kembali memegang kendali penuh atas hidup mereka.*
