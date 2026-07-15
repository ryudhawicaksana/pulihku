---
title: Ringkasan & OKR Proyek Pulihku
type: knowledge_base
tags:
  - nextjs
  - chrome-extension
  - neuroscience
  - rehabilitation
  - okr
---

# 🌱 Ringkasan & OKR Proyek: Pulihku

**Pulihku** adalah aplikasi web berbasis neurosains yang dirancang khusus sebagai asisten rehabilitasi mandiri untuk membantu individu memulihkan diri dari kecanduan pornografi. 

Berikut adalah pemetaan sasaran strategis, hasil utama (OKRs), status fungsionalitas saat ini, serta rencana pengembangan ke depannya.

---

## 🎯 Objective 1: Membangun Aplikasi Web Pemulihan Mandiri yang Interaktif dan Berfungsi Penuh
*Menyempurnakan fungsionalitas utama aplikasi web Pulihku dari status prototipe/dummy menjadi sistem asisten rehabilitasi mandiri yang responsif.*

### **KR 1.1 (Panic Button):** Mengimplementasikan timer visual dan panduan audio relaksasi/pernapasan yang berfungsi penuh pada modul SOS, serta mencatat riwayat pemakaian tombol darurat.
* **Status:** ⚠️ **Setengah Berfungsi**
* **Kondisi Saat Ini:** Modal pengalihan instan muncul dengan baik. Namun, pengarah napas belum memiliki timer/suara, dan tombol aksi (Push-up, Minum Air) baru berupa simulasi pop-up tanpa pencatatan riwayat.
* **Rencana Kedepan:** Menambahkan fungsionalitas timer hitung mundur visual dan pemutaran audio panduan napas, serta mengintegrasikan penyimpanan lokal (atau database) untuk merekam riwayat penggunaan SOS.

### **KR 1.2 (Jejak Pulih):** Mengubah grafik perkembangan (mingguan & bulanan) agar terhubung secara dinamis dengan pencatatan status harian riil pengguna yang disimpan di localStorage.
* **Status:** ⚠️ **Setengah Berfungsi**
* **Kondisi Saat Ini:** Tombol pencatatan relapse secara dinamis berfungsi dan menyetel ulang *streak* ke `0`. Namun, grafik perkembangan mingguan (Line Chart) dan bulanan (Bar Chart) masih menggunakan data tiruan (mock/statis).
* **Rencana Kedepan:** Mengimplementasikan penyimpanan data riwayat check-in harian di `localStorage` dan menghubungkannya dengan komponen grafik Recharts agar visualisasi perkembangan bersifat dinamis dan akurat.

### **KR 1.3 (AI Sahabat Pulih):** Mengintegrasikan antarmuka chat dengan API LLM riil (seperti Google Gemini API) untuk memberikan respons psikologis yang cerdas, kontekstual, dan memiliki persistensi riwayat obrolan lokal yang aman.
* **Status:** ⚠️ **Setengah Berfungsi**
* **Kondisi Saat Ini:** Antarmuka chat interaktif berjalan lancar. Namun, balasan masih diproses secara lokal menggunakan pencocokan kata kunci statis (hardcoded) dan riwayat obrolan akan hilang jika halaman di-refresh.
* **Rencana Kedepan:** Membangun rute API Next.js (`/api/chat`) yang terhubung dengan SDK Gemini API, serta mengimplementasikan penyimpanan lokal terenkripsi untuk mempertahankan riwayat obrolan.

### **KR 1.4 (Komunitas Anonim):** Menghubungkan halaman forum komunitas dengan backend (seperti Supabase atau Firebase) agar fitur posting cerita, komentar, dan like berfungsi secara real-time antar pengguna.
* **Status:** ❌ **Belum Berfungsi (Dummy/Placeholder)**
* **Kondisi Saat Ini:** Halaman forum hanya menampilkan daftar postingan statis dari state lokal. Tombol posting baru, komentar, dan like tidak berfungsi.
* **Rencana Kedepan:** Menghubungkan halaman Komunitas Anonim ke backend (misalnya Supabase) untuk menyimpan dan menyinkronkan kiriman, komentar, dan jumlah like secara real-time antar pengguna.

---

## 🎯 Objective 2: Menjamin Sistem Pemblokiran Konten Sensitif yang Terintegrasi dan Dinamis
*Meningkatkan kapabilitas perlindungan pengguna dengan menghubungkan kontrol daftar blokir di aplikasi web langsung ke ekstensi browser.*

### **KR 2.1 (Sinkronisasi Safe Browse):** Mengembangkan sistem Message Passing (komunikasi pesan) antara aplikasi web Pulihku dengan ekstensi Chrome pendamping.
* **Status:** ❌ **Belum Berfungsi (Dummy/Placeholder)**
* **Kondisi Saat Ini:** Antarmuka daftar blokir kustom di web app hanya mengubah state lokal dan tidak tersinkronisasi sama sekali dengan ekstensi browser.
* **Rencana Kedepan:** Menerapkan komunikasi pesan (Message Passing) menggunakan script pendukung (content/background script) di ekstensi Chrome agar dapat menerima sinyal pembaruan dari web app.

### **KR 2.2 (Dynamic Blocking):** Mengubah mekanisme pemblokiran ekstensi agar mendukung pembaruan aturan dinamis menggunakan `chrome.declarativeNetRequest.updateDynamicRules()` berdasarkan daftar blokir kustom yang diinput pengguna di web app.
* **Status:**  **Berjalan Penuh (Statis)**
* **Kondisi Saat Ini:** Ekstensi Chrome berhasil memblokir ratusan situs dewasa berdasarkan database statis yang disimpan di `rules.json`. Namun, aturan pemblokiran tidak dapat diubah secara dinamis dari web app.
* **Rencana Kedepan:** Memodifikasi ekstensi agar menggunakan API `chrome.declarativeNetRequest.updateDynamicRules()` sehingga aturan pemblokiran dapat diperbarui secara dinamis begitu ada pesan sinkronisasi dari web app.

---

## 🎯 Objective 3: Mempertahankan Keandalan dan Pengalaman Pengguna yang Premium
*Memastikan performa aplikasi web tetap optimal dengan transisi antarmuka yang mulus bagi pengguna.*

### **KR 3.1 (State Persistence):** Menjaga integritas data lokal di UserProvider (onboarding & streak) dengan arsitektur penyimpanan yang bebas dari kebocoran data (data corruption).
* **Status:**  **Berjalan Penuh**
* **Kondisi Saat Ini:** Alur onboarding dan perhitungan streak/skor pemulihan dinamis berbasis `UserProvider` berjalan dengan sangat baik dan tersimpan dengan aman di `localStorage` browser.
* **Rencana Kedepan:** Menambahkan mekanisme validasi data cadangan (*backup*) dan penanganan eror jika data di `localStorage` terhapus atau rusak secara tidak sengaja.

### **KR 3.2 (Aesthetic Performance):** Memastikan skor performa UI dengan Framer Motion dan Tailwind CSS tetap stabil pada nilai optimal (>90 pada penilaian Lighthouse/Core Web Vitals).
* **Status:**  **Berjalan Penuh**
* **Kondisi Saat Ini:** Komponen UI, layout, navigasi responsif, dan animasi transisi (menggunakan Tailwind dan Framer Motion) berjalan dengan sangat lancar dan berestetika tinggi.
* **Rencana Kedepan:** Menghindari penggunaan pustaka UI pihak ketiga yang berlebihan dan melakukan optimasi pemuatan gambar/aset visual agar performa tetap di atas skor 90.
