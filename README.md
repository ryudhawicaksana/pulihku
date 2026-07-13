# 🌱 Pulihku - Sahabat Pemulihan Digital Anda

Pulihku adalah aplikasi web berbasis neurosains yang dirancang khusus untuk membantu individu memulihkan diri dari kecanduan pornografi. Tidak sekadar memblokir, Pulihku bertindak sebagai asisten rehabilitasi mandiri yang mengedukasi, mendukung secara psikologis, dan membangun kebiasaan (dopamin) yang baru.

## ✨ Fitur Utama

- **Jejak Pulih (Tracker):** Lacak *streak* keberhasilan Anda (dari Level Benih hingga Hutan Raksasa), hitung skor pemulihan (*Recovery Score*), dan lacak suasana hati harian Anda.
- **AI Sahabat Pulih:** *Chatbot* bertenaga AI yang siap mendengarkan keluh kesah Anda tanpa menghakimi, dan memandu Anda melakukan teknik *grounding* saat *trigger* menyerang.
- **Panic Button (SOS):** Tombol darurat yang memberikan instruksi fisik cepat (seperti *push-up*, pernapasan) untuk mengalihkan lonjakan dopamin saat tergoda.
- **Akademi Pulih:** Modul edukasi untuk memahami sains di balik kecanduan, dopamin, dan *urge surfing*.
- **Komunitas Anonim:** Ruang aman berbagi kemenangan dan saling menyemangati tanpa mengungkap identitas.
- **Safe Browse (Ekstensi Browser):** Pemblokir tingkat jaringan berbasis *DeclarativeNetRequest* yang secara absolut menutup akses ke ratusan situs dewasa.

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

## 🛠️ Teknologi yang Digunakan

- **Framework:** Next.js 14+ (React)
- **Styling:** Tailwind CSS
- **Komponen:** shadcn/ui & Radix UI
- **Animasi:** Framer Motion
- **Ikon:** Lucide React
- **Manajemen Tanggal:** date-fns

---

*Dibuat untuk membantu siapa pun yang ingin merdeka dan kembali memegang kendali penuh atas hidup mereka.*
