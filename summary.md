---
title: Ringkasan Proyek Pulihku
type: knowledge_base
tags:
  - nextjs
  - chrome-extension
  - neuroscience
  - rehabilitation
  - localstorage
---

# 🌱 Ringkasan Proyek: Pulihku

**Pulihku** adalah aplikasi web berbasis neurosains yang dirancang khusus sebagai asisten rehabilitasi mandiri untuk membantu individu memulihkan diri dari kecanduan pornografi. Selain melacak kemajuan, Pulihku berfokus pada edukasi psikologis, dukungan emosional berbasis AI, pengalihan instan saat pemicu (*trigger*) menyerang, serta pemblokiran tingkat jaringan.

---

## 📂 Arsitektur & Struktur Proyek

Proyek ini terdiri dari dua komponen utama yang saling melengkapi:

1. **Aplikasi Web (Frontend Next.js):** 
   - Menggunakan Next.js (App Router) dengan Tailwind CSS dan Shadcn/ui.
   - Semua status pengguna (*state*) disimpan secara lokal di browser melalui `localStorage` (via React Context `UserProvider`).
   - Direktori utama: `src/app/` dan `src/components/`.

2. **Ekstensi Browser (Safe Browse):**
   - Terletak di direktori `pulihku-extension/`.
   - Menggunakan Manifest V3 dan API `declarativeNetRequest` Chrome untuk memblokir situs-situs dewasa secara absolut di tingkat jaringan.

---

## 🛠️ Stack Teknologi

- **Framework & Core:** Next.js 14+ (React), TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Animasi:** Framer Motion
- **Ikon:** Lucide React
- **Manajemen Tanggal:** `date-fns` (untuk perhitungan durasi streak secara dinamis)

---

## 📊 Status Implementasi Fitur

| Fitur | Status Kesiapan | Deskripsi Teknis & State Saat Ini |
| :--- | :--- | :--- |
| **Sistem Onboarding** |  **Berjalan Penuh** | Mengumpulkan profil, motivasi, dan tingkat kecanduan pengguna baru. Data disimpan di `localStorage` dan otomatis mengarahkan ke dashboard. |
| **Dashboard & Streak** |  **Berjalan Penuh** | Menghitung durasi kebersihan (*streak*) secara real-time dari selisih `startDate` dan tanggal saat ini. Menampilkan *Recovery Score*. |
| **Akademi Pulih** |  **Berjalan Penuh** | Modul edukasi sains kecanduan dan neurosains. Dapat membaca artikel dan memutar video tersemat (YouTube) secara langsung. |
| **Panic Button (SOS)** | ⚠️ **Setengah Berfungsi** | Modal pengalihan instan muncul dengan baik. Namun, pengarah napas belum memiliki timer/suara, dan tombol aksi (Push-up, Minum Air) baru berupa simulasi pop-up tanpa penyimpanan data. |
| **Jejak Pulih (Tracker)** | ⚠️ **Setengah Berfungsi** | Pencatatan relapse secara dinamis berfungsi dan menyetel ulang *streak* ke `0`. Namun, grafik perkembangan mingguan dan bulanan masih menggunakan data tiruan (mock). |
| **AI Sahabat Pulih** | ⚠️ **Setengah Berfungsi** | Antarmuka chat interaktif sangat responsif. Namun, balasan masih menggunakan pencocokan kata kunci statis lokal secara *hardcoded* (tidak menggunakan API LLM nyata) dan riwayat terhapus jika di-refresh. |
| **Safe Browse (Web)** | ❌ **Dummy / Placeholder** | Menu visual untuk daftar blokir kustom sudah ada, tetapi belum tersambung ke ekstensi browser (hanya mengubah state React lokal). |
| **Safe Browse (Ekstensi)** |  **Berjalan Penuh (Statis)** | Berhasil memblokir ratusan situs dewasa secara absolut menggunakan aturan statis di file `pulihku-extension/rules.json`. |
| **Komunitas Anonim** | ❌ **Dummy / Placeholder** | Menampilkan antarmuka forum statis. Pengguna belum bisa memposting cerita, memberikan komentar, ataupun menyukai postingan secara real-time. |

---

## 🚀 Rencana Pengembangan Selanjutnya (Roadmap)

1. **Integrasi AI Pintar (Gemini API):**
   - Menghubungkan chatbot di `src/app/(app)/ai/page.tsx` ke model LLM riil (seperti Google Gemini API).
   - Menyimpan riwayat obrolan secara lokal secara terenkripsi agar tidak hilang saat halaman dimuat ulang.
2. **Sinkronisasi Ekstensi Browser (Message Passing):**
   - Menambahkan fitur sinkronisasi dinamis agar daftar blokir kustom dari web app dapat langsung memperbarui aturan filter pada ekstensi secara real-time menggunakan `chrome.declarativeNetRequest.updateDynamicRules()`.
3. **Penyimpanan Riwayat Tracker Dinamis:**
   - Menyimpan riwayat check-in harian pengguna ke dalam database lokal (atau `localStorage` terstruktur) untuk dipetakan ke dalam grafik secara dinamis.
4. **Backend Forum Komunitas:**
   - Menghubungkan halaman Komunitas Anonim ke backend serverless (seperti Supabase atau Firebase) untuk menangani postingan, komentar, dan *like* secara real-time.
