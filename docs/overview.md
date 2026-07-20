---
type: overview
title: "Gambaran Umum Pulihku"
description: "Pengenalan platform pemulihan digital mandiri Pulihku, fitur utama, dan teknologi pendukung."
tags: ["overview", "introduction", "tech-stack"]
timestamp: "2026-07-20"
---

# 🌱 Gambaran Umum Proyek Pulihku

**Pulihku** adalah aplikasi web berbasis Next.js dan ekstensi browser Chrome (Safe Browse) yang dirancang secara khusus untuk membantu individu memulihkan diri dari kecanduan pornografi. 

Platform ini bertindak sebagai asisten rehabilitasi mandiri yang mengedukasi pengguna secara neurosains, memberikan dukungan psikologis interaktif, serta membangun kebiasaan dan tingkat kepatuhan positif yang baru.

---

## ✨ Fitur Utama Platform

*   **Jejak Pulih (Tracker):** Lacak durasi hari bersih (*streak*) dari Level Benih hingga Hutan Raksasa, hitung skor pemulihan (*Recovery Score*), dan catat jurnal suasana hati harian.
*   **AI Sahabat Pulih:** Obrolan bertenaga AI dengan model `Qwen2.5-7B-Instruct` melalui API Hugging Face yang siap mendengarkan keluh kesah pengguna tanpa menghakimi. Dilengkapi persistensi riwayat chat lokal.
*   **Panic Button (SOS):** Tombol darurat yang memandu latihan pernapasan *Box Breathing* (pola 4-4-4 selama 60 detik) secara visual dan interaktif untuk melewati dorongan hasrat (*craving*) kritis.
*   **Akademi Pulih:** Modul edukasi sains tentang dopamin, kecanduan, dan teknik pemulihan seperti *urge surfing*, dengan fitur pelacakan progres membaca di Supabase.
*   **Toko XP:** Tukarkan akumulasi poin XP hasil kedisiplinan harian dengan *Perisai Pemulihan* (melindungi streak dari reset), *Streak Freeze*, atau *Avatar Premium*.
*   **Komunitas Anonim:** Ruang diskusi aman tanpa identitas asli untuk membagikan kemenangan dan saling menyemangati secara langsung (real-time).
*   **Safe Browse (Ekstensi Browser):** Pemblokir tingkat jaringan berbasis *DeclarativeNetRequest* (Manifest V3) yang memblokir ratusan situs dewasa dan memaksa Safe Search aktif pada mesin pencari Google & Bing.
*   **Progressive Web App (PWA):** Dukungan penuh instalasi PWA di HP Android/iOS layaknya aplikasi native.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

*   **Framework Utama:** Next.js 16 (App Router)
*   **Autentikasi & Database:** Supabase (PostgreSQL dengan RLS/Row Level Security yang aman)
*   **UI & Styling:** Vanilla CSS, Tailwind CSS, & shadcn/ui
*   **Animasi:** Framer Motion
*   **Analitik & Session Replay:** PostHog Analytics
*   **Email Transaksional:** Resend Email API
*   **PWA Enabler:** Service Worker Native Browser
