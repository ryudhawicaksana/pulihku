---
type: guide
title: "Panduan Konfigurasi & Ekstensi"
description: "Panduan langkah demi langkah untuk mengonfigurasi variabel lingkungan di Netlify, menginstal ekstensi Chrome, dan mengaktifkan PWA."
tags: ["setup", "configuration", "deployment", "chrome-extension", "pwa"]
timestamp: "2026-07-20"
---

# 🛠️ Panduan Konfigurasi & Ekstensi

Gunakan panduan ini untuk melakukan konfigurasi produksi website Pulihku di Netlify dan memuat ekstensi pendamping di browser Chrome.

---

## ☁️ 1. Variabel Lingkungan Netlify (Environment Variables)

Untuk mengaktifkan seluruh ekosistem di server produksi, Anda harus mendaftarkan variabel-variabel lingkungan berikut pada panel dashboard **Netlify Site Settings -> Environment variables**:

| Variable Key | Deskripsi | Sumber Nilai |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Kunci otorisasi pengiriman email transaksional nyata. | Akun pengembang di [resend.com](https://resend.com) |
| `HF_API_KEY` | Kunci otorisasi pengolahan bahasa natural AI Sahabat. | Token di [huggingface.co](https://huggingface.co) |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint API untuk terhubung ke database Postgres Supabase. | Dashboard Proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci enkripsi anonim publik untuk akses client-side. | Dashboard Proyek Supabase |
| `NEXT_PUBLIC_POSTHOG_KEY` | Kunci otorisasi analitik & Session Replay PostHog. | Dashboard Proyek PostHog |

*Catatan: Pastikan Anda melakukan **Trigger deploy** ulang (atau melakukan Git Push) setelah menambahkan variabel-variabel tersebut agar Netlify memuat nilainya ke dalam build Next.js terbaru.*

---

## 🔌 2. Cara Memasang Ekstensi Browser "Safe Browse"

Aplikasi web memiliki batasan sandbox keamanan yang ketat sehingga tidak dapat memblokir tab browser lain. Untuk mengaktifkan perlindungan pemblokiran absolut di browser Chrome/Edge, gunakan ekstensi pendamping ini:

1.  Akses menu **Safe Browse** pada website online Anda, lalu klik tombol **Unduh Ekstensi Pulihku (.zip)**.
2.  Ekstrak file `.zip` hasil unduhan tersebut ke suatu folder di komputer Anda.
3.  Buka browser Chrome/Edge dan ketikkan `chrome://extensions/` pada bilah alamat, lalu tekan Enter.
4.  Aktifkan **Developer Mode** (Mode Pengembang) di pojok kanan atas halaman ekstensi browser.
5.  Klik tombol **Load Unpacked** (Muat Ekstensi Tidak Dikemas) di pojok kiri atas.
6.  Pilih folder `pulihku-extension` yang telah Anda ekstrak sebelumnya.
7.  Ekstensi kini aktif dan akan menyinkronkan daftar blokir kustom dari website secara otomatis!

---

## 📱 3. Cara Menginstal Progressive Web App (PWA)

PWA memungkinkan website Pulihku berjalan layaknya aplikasi native (layar penuh, responsif, dan cepat) di perangkat Anda.

### Pada Perangkat Android (Google Chrome):
*   Buka situs Pulihku di browser Chrome Anda.
*   Klik ikon titik tiga di pojok kanan atas layar.
*   Pilih **Tambahkan ke Layar Utama** (atau **Instal Aplikasi**).
*   Konfirmasikan instalasi. Aplikasi Pulihku kini akan muncul di laci aplikasi Android Anda.

### Pada Perangkat iOS / iPhone (Safari):
*   Buka situs Pulihku di browser Safari.
*   Klik tombol **Bagikan (Share)** di bagian bawah layar (ikon persegi dengan panah ke atas).
*   Gulir ke bawah dan pilih **Tambahkan ke Layar Utama (Add to Home Screen)**.
*   Klik **Tambah**. Aplikasi Pulihku kini akan muncul di Home Screen iPhone Anda.
