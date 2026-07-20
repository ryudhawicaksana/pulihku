---
type: documentation
title: "Daftar Fitur & Status Kefungsian"
description: "Tabel kepatuhan operasional fitur Pulihku dan spesifikasi teknis implementasinya."
tags: ["features", "status", "technical-spec"]
timestamp: "2026-07-20"
---

# 📊 Daftar Fitur & Status Kefungsian

Seluruh fitur inti di dalam aplikasi web Pulihku dan Ekstensi Safe Browse saat ini berstatus **Berjalan Penuh (100% Fungsional)** dan terintegrasi baik dengan database serta API eksternal.

## 📈 Tabel Kepatuhan Fitur

| Fitur | Status | Deskripsi Teknis |
| :--- | :--- | :--- |
| **Sistem Onboarding** |  **Berjalan Penuh** | Mengautentikasi pengguna via Supabase Auth, merekam preferensi kuesioner ke data profil pengguna di Supabase (`users_pemulihan`), dan mengarahkan pengguna secara otomatis ke halaman yang sesuai. |
| **Dashboard & Streak** |  **Berjalan Penuh** | Menghitung streak hari bersih dinamis menggunakan selisih tanggal `start_date` dari database. Menampilkan visualisasi skor pemulihan (*Recovery Score*) secara real-time. |
| **Panic Button (SOS)** |  **Berjalan Penuh** | Menyediakan modal darurat dengan Box Breathing 60 detik (animasi visual fase Tarik-Tahan-Hembuskan), mencatat log aksi darurat ke tabel `users_sos_logs` Supabase, dan memberikan hadiah +25 XP. |
| **Jejak Pulih (Tracker)** |  **Berjalan Penuh** | Menyediakan input mood harian (emoji & catatan jurnal) yang tersimpan di tabel `users_daily_logs`. Area Chart mingguan dan Bar Chart bulanan di-render secara dinamis dari database log pengguna. |
| **AI Sahabat Pulih** |  **Berjalan Penuh** | Obrolan cerdas terintegrasi ke model `Qwen2.5-7B-Instruct` via rute API `/api/chat` Hugging Face. Riwayat chat disimpan secara persisten di `localStorage` per ID akun pengguna. |
| **Akademi Pulih** |  **Berjalan Penuh** | Menyediakan kartu artikel neurosains interaktif, pemutaran video YouTube, dan pelacakan progres membaca modul yang tersimpan di tabel `user_academy_progress` Supabase. |
| **Toko XP** |  **Berjalan Penuh** | Memfasilitasi penukaran XP pengguna untuk membeli Perisai Pemulihan, Streak Freeze, dan membuka Avatar Premium. Seluruh aksi pembelian disinkronisasikan ke Supabase. |
| **Komunitas Anonim** |  **Berjalan Penuh** | Menghubungkan pembuatan postingan, komentar, dan pencatatan suka (like/unlike) secara real-time ke tabel-tabel komunitas di Supabase. |
| **Safe Browse (Ekstensi)** |  **Berjalan Penuh** | Sinkronisasi dua arah menggunakan pesan browser (`postMessage`). Penambahan daftar blokir kustom di web app langsung memperbarui aturan dinamis (`declarativeNetRequest`) di Chrome Extension. |

---

## 🔒 Keamanan & Analitik

*   **Autentikasi Aman:** Menggunakan Supabase Row Level Security (RLS) di PostgreSQL untuk menjamin data pribadi (streak, log harian, log SOS) hanya dapat dibaca dan dimodifikasi oleh pemilik akun tersebut.
*   **PostHog Telemetri:** Seluruh interaksi pengguna yang bernilai bisnis penting (seperti pendaftaran selesai, penekanan Panic Button, pencatatan relapse, dan pembelian toko) direkam secara aman ke server PostHog untuk evaluasi kenyamanan antarmuka (*UI/UX design feedback*).
