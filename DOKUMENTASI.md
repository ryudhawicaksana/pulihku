# 🌱 Dokumentasi Proyek Pulihku

Selamat datang di dokumentasi teknis **Pulihku**, sebuah aplikasi berbasis web (Next.js) dan ekstensi browser (Chrome Extension) yang dirancang sebagai asisten rehabilitasi mandiri untuk memulihkan diri dari kecanduan pornografi.

Dokumentasi ini dibuat untuk membantu Anda memahami struktur proyek, alur kerja aplikasi, serta pemetaan detail mengenai fitur mana yang sudah berjalan penuh dan fitur mana yang saat ini masih berupa **dummy/placeholder** (belum berfungsi sepenuhnya).

---

## 📂 Struktur Proyek & Arsitektur

Proyek ini terbagi menjadi dua bagian utama:
1. **Web Application (Frontend Next.js):** Terletak di direktori utama, menggunakan Next.js (App Router) dengan Tailwind CSS, Framer Motion untuk animasi, dan Shadcn/ui untuk komponen antarmuka.
2. **Chrome Extension (Safe Browse):** Terletak di folder `pulihku-extension`, menggunakan Manifest V3 dan `declarativeNetRequest` untuk memblokir pemicu visual di tingkat browser.

### Pohon Direktori Utama
*   `src/app/` - Halaman-halaman utama aplikasi (App Router).
    *   `src/app/(app)/` - Rute berproteksi onboarding (Dashboard, Jejak, AI, Akademi, Komunitas, Safe-Browse, Profil).
    *   `src/app/onboarding/` - Alur tanya jawab pengguna baru.
*   `src/components/` - Komponen UI global (Shadcn/ui, Panic Button, User Provider).
*   `pulihku-extension/` - Ekstensi Chrome pendamping untuk pemblokiran jaringan.

---

## 🔄 Cara Aplikasi Ini Berjalan

1.  **State & Persistence (Local):** Aplikasi menggunakan [user-provider.tsx](file:///Users/ltdinfyudha/Documents/PULIHKU/src/components/user-provider.tsx) berbasis React Context untuk menyimpan status pengguna (`UserData`). Semua data disimpan secara lokal di browser melalui `localStorage` dengan kunci `pulihku_user`.
2.  **Onboarding Routing:** Ketika pengguna pertama kali mengakses aplikasi, middleware di `UserProvider` memeriksa apakah ada data pengguna. Jika tidak ada, pengguna otomatis diarahkan ke halaman `/onboarding`.
3.  **Streak Calculation:** Tanggal mulai pemulihan (`startDate`) disimpan dalam format ISO. Setiap kali dashboard dibuka, aplikasi menghitung selisih hari antara tanggal saat ini dengan `startDate` menggunakan pustaka `date-fns` untuk mendapatkan durasi *streak* (hari bersih).
4.  **Relapse Reset:** Ketika pengguna melaporkan *relapse* (kambuh), `startDate` diatur ulang menjadi waktu saat ini (`new Date().toISOString()`), yang secara otomatis menyetel ulang *streak* ke `0` hari dan menambahkan hitungan `relapseCount`.

---

## 📊 Tabel Status & Kefungsian Fitur

| Fitur | Status | Deskripsi Teknis |
| :--- | :--- | :--- |
| **Sistem Onboarding** |  **Berjalan Penuh** | Mengumpulkan data profil, rentang usia, frekuensi pemicu, dan motivasi, serta menyimpannya secara lengkap ke data lokal (`localStorage`). |
| **Dashboard & Streak** |  **Berjalan Penuh** | Menampilkan *streak* saat ini secara dinamis berdasarkan data `localStorage`. Menghitung skor pemulihan (*Recovery Score*) secara real-time. |
| **Panic Button (SOS)** | ⚠️ **Setengah Berfungsi** | Tombol pemicu modal pengalihan berjalan baik. Namun, fitur meditasi pernapasan tidak memiliki pengatur waktu (timer) atau suara pengarah, dan aksi seperti "Push-up" & "Minum Air" hanya menampilkan notifikasi pop-up simulasi tanpa logging. |
| **Jejak Pulih (Tracker)** | ⚠️ **Setengah Berfungsi** | Tombol *Catat Relapse* dan tab overview berjalan dinamis. Namun, grafik perkembangan mingguan (Line Chart) dan bulanan (Bar Chart) menggunakan data statis/palsu (mock). |
| **AI Sahabat Pulih** | ⚠️ **Setengah Berfungsi** | Antarmuka chat interaktif berjalan dengan baik. Percakapan diproses menggunakan pencocokan kata kunci statis lokal (`setTimeout`) dengan respons yang telah ditentukan. **Tidak terhubung ke API AI nyata** (seperti Gemini/OpenAI) dan riwayat chat akan terhapus jika halaman dimuat ulang. |
| **Akademi Pulih** |  **Berjalan Penuh** | Menampilkan kartu modul edukasi. Membaca artikel neurosains serta memutar video YouTube tersemat dalam modal dialog berjalan lancar. |
| **Komunitas Anonim** | ❌ **Dummy / Placeholder** | Hanya menampilkan daftar postingan statis dari state lokal. Tombol filter, interaksi (like/comment/view), dan tombol terapung untuk menambah postingan baru belum berfungsi sama sekali. |
| **Safe Browse (Halaman Web)** | ❌ **Dummy / Placeholder** | Antarmuka statistik dan daftar blokir kustom bersifat visual saja. Aksi menambah/menghapus daftar blokir kustom hanya mengubah state React lokal dan **tidak tersinkronisasi ke ekstensi browser**. |
| **Safe Browse (Ekstensi)** |  **Berjalan Penuh (Statis)** | Ekstensi Chrome memblokir situs-situs dewasa secara absolut berdasarkan database statis di file [rules.json](file:///Users/ltdinfyudha/Documents/PULIHKU/pulihku-extension/rules.json). Namun, tidak ada fitur sinkronisasi dengan konfigurasi dari web app. |

---

## 🔍 Detail Bagian yang Belum Berfungsi & Penjelasan Teknis

### 1. Sistem Onboarding
*   **Status:** **Telah Diperbaiki**. Seluruh data kuesioner kini disimpan secara lokal di browser melalui `localStorage`.

### 2. AI Sahabat Pulih
*   **Masalah:** Obrolan pada [ai/page.tsx](file:///Users/ltdinfyudha/Documents/PULIHKU/src/app/(app)/ai/page.tsx) menggunakan deteksi kata kunci manual (seperti mencari kata "stres", "gagal", "godaan") untuk mengeluarkan respons *hardcoded*. Chatbot ini tidak cerdas dan tidak mengingat konteks obrolan masa lalu.
*   **Solusi Selanjutnya:** Integrasikan rute API Next.js (`/api/chat`) yang terhubung ke model bahasa besar (LLM) seperti Google Gemini API menggunakan SDK `@google/generative-ai`. Gunakan database lokal (seperti SQLite/IndexedDB) atau LocalStorage terenkripsi untuk menyimpan riwayat chat.

### 3. Sinkronisasi Safe Browse & Ekstensi Browser
*   **Masalah:** Daftar blokir kustom di [safe-browse/page.tsx](file:///Users/ltdinfyudha/Documents/PULIHKU/src/app/(app)/safe-browse/page.tsx) (contoh: Twitter, Instagram) tidak dapat dikirim ke Chrome Extension. Ekstensi berjalan terisolasi dan hanya membaca [rules.json](file:///Users/ltdinfyudha/Documents/PULIHKU/pulihku-extension/rules.json) statis.
*   **Solusi Selanjutnya:** Terapkan komunikasi pesan (Message Passing) di Chrome Extension. Gunakan `chrome.runtime.sendMessage` dari web app (atau lewat content script) untuk memperbarui aturan pemblokiran dinamis menggunakan metode `chrome.declarativeNetRequest.updateDynamicRules()`.

### 4. Grafik & Statistik Real-Time
*   **Masalah:** Grafik di [jejak/page.tsx](file:///Users/ltdinfyudha/Documents/PULIHKU/src/app/(app)/jejak/page.tsx) tidak mencerminkan data kebersihan harian pengguna yang sesungguhnya. Grafik garis (`lineChartData`) sepenuhnya statis.
*   **Solusi Selanjutnya:** Buat pencatatan riwayat harian di `localStorage`. Setiap hari, simpan status apakah pengguna berhasil melewati hari tersebut tanpa relapse atau mengalami relapse, kemudian petakan riwayat tersebut ke dalam komponen grafik Recharts secara dinamis.

### 5. Komunitas Anonim
*   **Masalah:** Komunitas di [komunitas/page.tsx](file:///Users/ltdinfyudha/Documents/PULIHKU/src/app/(app)/komunitas/page.tsx) tidak terhubung ke backend server. Pengguna tidak bisa memposting cerita baru, menyukai (*like*), atau mengomentari postingan orang lain.
*   **Solusi Selanjutnya:** Hubungkan halaman komunitas dengan backend API (misal menggunakan Supabase, Firebase, atau REST API kustom) untuk menyimpan postingan, komentar, dan jumlah suka secara real-time antar pengguna.

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

1.  **Instalasi Dependensi:**
    ```bash
    npm install
    ```
2.  **Jalankan Mode Pengembangan:**
    ```bash
    npm run dev
    ```
3.  **Memuat Ekstensi Pemblokir:**
    *   Buka Google Chrome / Brave / Edge.
    *   Akses halaman `chrome://extensions/`.
    *   Aktifkan tombol **Developer Mode** di kanan atas.
    *   Klik **Load Unpacked** dan pilih direktori `pulihku-extension`.
