-- ==========================================
-- SKEMA SUPABASE UNTUK APLIKASI PULIHKU
-- Jalankan kode SQL ini di panel SQL Editor Supabase Anda
-- ==========================================

-- 1. TABEL UTAMA PENGGUNA (Jika belum dibuat)
CREATE TABLE IF NOT EXISTS users_pemulihan (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INT,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    relapse_count INT DEFAULT 0,
    avatar TEXT DEFAULT '🌱',
    answers JSONB DEFAULT '{}'::jsonb,
    xp INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan RLS pada tabel users_pemulihan
ALTER TABLE users_pemulihan ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses (Policy) untuk users_pemulihan
CREATE POLICY "Pengguna dapat membaca data profil sendiri" ON users_pemulihan
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Pengguna dapat mengubah data profil sendiri" ON users_pemulihan
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Pengguna dapat memasukkan data profil sendiri" ON users_pemulihan
    FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. TABEL KOMUNITAS POSTS (Postingan Anonim)
CREATE TABLE IF NOT EXISTS komunitas_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT DEFAULT 'Anonim',
    author_avatar TEXT DEFAULT '🌱',
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan RLS pada tabel komunitas_posts
ALTER TABLE komunitas_posts ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses (Policy) untuk komunitas_posts
CREATE POLICY "Semua orang dapat membaca postingan komunitas" ON komunitas_posts
    FOR SELECT USING (true);

CREATE POLICY "Pengguna terautentikasi dapat membuat postingan" ON komunitas_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pembuat postingan dapat memperbarui/menghapus postingan sendiri" ON komunitas_posts
    FOR ALL USING (auth.uid() = user_id);


-- 3. TABEL KOMUNITAS LIKES (Menghindari Double Likes)
CREATE TABLE IF NOT EXISTS komunitas_likes (
    post_id UUID REFERENCES komunitas_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

-- Mengaktifkan RLS pada tabel komunitas_likes
ALTER TABLE komunitas_likes ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses untuk komunitas_likes
CREATE POLICY "Semua orang dapat melihat likes" ON komunitas_likes
    FOR SELECT USING (true);

CREATE POLICY "Pengguna terautentikasi dapat menyukai postingan" ON komunitas_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pengguna dapat membatalkan suka (unlike)" ON komunitas_likes
    FOR DELETE USING (auth.uid() = user_id);


-- 4. TABEL KOMUNITAS COMMENTS (Komentar Anonim)
CREATE TABLE IF NOT EXISTS komunitas_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES komunitas_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT DEFAULT 'Anonim',
    author_avatar TEXT DEFAULT '🌱',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan RLS pada tabel komunitas_comments
ALTER TABLE komunitas_comments ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses untuk komunitas_comments
CREATE POLICY "Semua orang dapat membaca komentar" ON komunitas_comments
    FOR SELECT USING (true);

CREATE POLICY "Pengguna terautentikasi dapat memberikan komentar" ON komunitas_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 5. TABEL HARIAN TRACKER (Jejak Log Harian)
CREATE TABLE IF NOT EXISTS users_daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    clean_status BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = bersih, FALSE = relapse
    mood_score INT, -- Nilai mood 1-5
    craving_level INT, -- Tingkat godaan/keinginan 1-5
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, log_date)
);

-- Mengaktifkan RLS pada tabel users_daily_logs
ALTER TABLE users_daily_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses untuk users_daily_logs
CREATE POLICY "Pengguna dapat mengakses log harian sendiri" ON users_daily_logs
    FOR ALL USING (auth.uid() = user_id);
