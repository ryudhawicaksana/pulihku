---
type: architecture
title: "Arsitektur Teknis Pulihku"
description: "Arsitektur direktori proyek, mekanisme persistensi status, dan detail skema database Supabase."
tags: ["architecture", "supabase", "database-schema", "directory-structure"]
timestamp: "2026-07-20"
---

# 📂 Arsitektur Teknis & Skema Database

Bagian ini memaparkan struktur direktori utama dan desain database relasional Supabase yang digunakan dalam platform Pulihku.

---

## 📂 Struktur Direktori Proyek

```
PULIHKU/
├── .opencode/                  # Struktur Pengetahuan & OKF
│   └── commands/               # Definisi perintah agen kustom
├── docs/                       # OKF Dokumentasi Pengetahuan Proyek
├── public/                     # Aset statis & Service Worker PWA (sw.js)
├── pulihku-extension/          # Ekstensi Chrome pendamping (Safe Browse)
│   ├── background.js           # Worker pengelola declarativeNetRequest
│   ├── content_script.js       # Jembatan komunikasi web ke ekstensi
│   └── manifest.json           # Manifest Ekstensi Chrome V3
└── src/
    ├── app/                    # Next.js App Router
    │   ├── (app)/              # Rute utama berproteksi login
    │   │   ├── ai/             # Chat AI Sahabat Pulih
    │   │   ├── jejak/          # Tracker progres & mood harian
    │   │   ├── komunitas/      # Forum diskusi anonim
    │   │   ├── safe-browse/    # Pengaturan blokir & instalasi ekstensi
    │   │   └── toko/           # XP exchange & shop
    │   ├── api/                # Next.js Serverless API endpoints
    │   │   ├── chat/           # Rute API Hugging Face Chat
    │   │   ├── cron/           # Trigger otomatisasi check-in harian
    │   │   └── email/          # Email transaksional via Resend API
    │   └── onboarding/         # Formulir onboarding & registrasi
    ├── components/             # Komponen UI global (React Context Providers)
    └── lib/                    # Utilitas backend, analytics, & ranks
```

---

## 💾 State & Persistence

*   **Penyimpanan Utama (Cloud):** Seluruh data terenkripsi dan disimpan di database relasional Supabase.
*   **Penyimpanan Cadangan (Client):** Obrolan AI dan data profil dasar di-cache di browser pengguna melalui `localStorage` dengan kunci awalan `pulihku_` untuk mengurangi latensi render komponen Next.js.
*   **Kepatuhan Autentikasi:** State otorisasi ditangani oleh `supabase.auth.onAuthStateChange` di dalam [UserProvider](file:///Users/ltdinfyudha/Documents/PULIHKU/src/components/user-provider.tsx) untuk memastikan transisi login/logout yang lancar.

---

## 🗄️ Skema Database Supabase

Tabel-tabel relasional di dalam database Supabase meliputi:

1.  **`users_pemulihan`**: Menyimpan data profil utama, poin XP, tanggal mulai pemulihan, jumlah relapse, perisai, dan riwayat avatar yang terbuka.
2.  **`users_daily_logs`**: Menyimpan catatan suasana hati (mood score) dan status keberhasilan hari bersih harian.
3.  **`users_sos_logs`**: Menyimpan riwayat penggunaan tombol darurat (SOS) dan tindakan pengalihan yang diambil.
4.  **`komunitas_posts`**: Menyimpan tulisan/cerita anonim pengguna di forum komunitas.
5.  **`komunitas_comments`**: Menyimpan komentar/tanggapan dari postingan di forum komunitas.
6.  **`komunitas_likes`**: Menyimpan metadata suka (like) untuk menghindari duplikasi suka oleh satu pengguna pada postingan yang sama.
7.  **`user_academy_progress`**: Menyimpan modul akademi yang telah selesai dibaca oleh pengguna.

### ⚡ Database Triggers & Functions (PostgreSQL)

Untuk menjamin konsistensi jumlah suka dan komentar di forum komunitas tanpa bergantung pada backend Next.js, database Supabase dilengkapi dengan Trigger otomatis:

*   **`trg_update_comments_count`**: Mengupdate kolom `comments_count` di tabel `komunitas_posts` secara otomatis setiap kali ada baris baru ditambahkan/dihapus di tabel `komunitas_comments`.
*   **`trg_update_likes_count`**: Mengupdate kolom `likes_count` di tabel `komunitas_posts` secara otomatis setiap kali ada aksi suka/batal suka di tabel `komunitas_likes`.
