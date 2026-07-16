"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, GlobeLock, AlertTriangle, Download, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/user-provider";
import { supabase } from "@/lib/supabase";

export default function SafeBrowsePage() {
  const { user } = useUser();
  const [customBlocks, setCustomBlocks] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  const [safeSearchEnabled, setSafeSearchEnabled] = useState(true);

  // Load initial custom blocks from localStorage / Supabase on mount
  useEffect(() => {
    if (user?.answers?.custom_blocks) {
      setCustomBlocks(user.answers.custom_blocks as string[]);
      localStorage.setItem("pulihku_custom_blocks", JSON.stringify(user.answers.custom_blocks));
    } else {
      const stored = localStorage.getItem("pulihku_custom_blocks");
      if (stored) {
        setCustomBlocks(JSON.parse(stored));
      } else {
        const defaultBlocks = ["twitter.com", "instagram.com"];
        setCustomBlocks(defaultBlocks);
        localStorage.setItem("pulihku_custom_blocks", JSON.stringify(defaultBlocks));
      }
    }
  }, [user]);

  // Listen for replies from the content script
  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (event.data && event.data.source === "pulihku-extension") {
        if (event.data.type === "PONG") {
          setIsExtensionActive(event.data.active);
        }
      }
    };

    window.addEventListener("message", handleExtensionMessage);

    // Send a ping to check if extension is active
    const checkExtension = () => {
      window.postMessage({ source: "pulihku-web", type: "PING" }, "*");
    };

    // Ping immediately
    checkExtension();

    // Ping periodically to detect if extension gets enabled or disabled
    const interval = setInterval(checkExtension, 2000);

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
      clearInterval(interval);
    };
  }, []);

  // Send settings to extension whenever they change or extension becomes active
  useEffect(() => {
    if (isExtensionActive) {
      window.postMessage({
        source: "pulihku-web",
        type: "UPDATE_SETTINGS",
        domains: customBlocks,
        safeSearch: safeSearchEnabled
      }, "*");
    }
  }, [customBlocks, safeSearchEnabled, isExtensionActive]);

  const syncToSupabase = async (blocks: string[]) => {
    if (!user) return;
    try {
      const updatedAnswers = {
        ...user.answers,
        custom_blocks: blocks
      };

      const { error } = await supabase
        .from("users_pemulihan")
        .update({ answers: updatedAnswers })
        .eq("id", user.id);

      if (error) throw error;

      // Update local storage user profile cache
      const storedUser = localStorage.getItem("pulihku_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        u.answers = updatedAnswers;
        localStorage.setItem("pulihku_user", JSON.stringify(u));
      }
    } catch (err) {
      console.error("Gagal menyelaraskan daftar blokir ke Supabase:", err);
    }
  };

  const addBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!clean) return;
    if (customBlocks.includes(clean)) {
      setNewDomain("");
      return;
    }
    const updated = [...customBlocks, clean];
    setCustomBlocks(updated);
    localStorage.setItem("pulihku_custom_blocks", JSON.stringify(updated));
    setNewDomain("");
    await syncToSupabase(updated);
  };

  const removeBlock = async (domain: string) => {
    const updated = customBlocks.filter(b => b !== domain);
    setCustomBlocks(updated);
    localStorage.setItem("pulihku_custom_blocks", JSON.stringify(updated));
    await syncToSupabase(updated);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Safe Browse</h1>
        <p className="text-muted-foreground text-lg">Kendalikan lingkungan digital Anda. Blokir pemicu sebelum mereka muncul.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Status & Ekstensi */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Ekstensi Pemblokir Pulihku</CardTitle>
                  <CardDescription>Perlindungan tingkat browser untuk perangkat ini.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                Aplikasi web tidak dapat memblokir situs di browser Anda secara otomatis demi keamanan. Untuk benar-benar memblokir ratusan situs dewasa, pornografi, dan pemicu lainnya (seperti Pornhub, Xvideos, dll), Anda perlu memasang <strong>Ekstensi Pendamping Pulihku</strong>.
              </p>
              
              <div className="bg-background p-4 rounded-xl border flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Cara Pemasangan di Google Chrome:</h4>
                  <ol className="list-decimal pl-4 text-sm text-muted-foreground mt-1 space-y-2">
                    <li>Klik tombol **Unduh Ekstensi Pulihku** di bawah untuk mengunduh file <code>.zip</code>.</li>
                    <li>Ekstrak (unzip) file yang telah diunduh di komputer Anda.</li>
                    <li>Buka browser Chrome dan ketik <code>chrome://extensions/</code> pada bilah alamat lalu tekan Enter.</li>
                    <li>Aktifkan <strong>Developer Mode</strong> (Mode Pengembang) di pojok kanan atas halaman ekstensi Chrome.</li>
                    <li>Klik tombol <strong>Load unpacked</strong> (Muat ekstensi tidak dikemas) di pojok kiri atas.</li>
                    <li>Pilih folder hasil ekstrak file zip tadi (folder <code>pulihku-extension</code>).</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full gap-2 text-lg h-12"
                onClick={() => {
                  window.location.href = "/pulihku-extension.zip";
                }}
              >
                <Download className="w-5 h-5" />
                Unduh Ekstensi Pulihku (.zip)
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Database Pemblokiran</CardTitle>
              <CardDescription>Situs-situs berikut otomatis diblokir saat ekstensi aktif.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">124</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Situs</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">48</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Video Porn</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">21</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Premium</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">12</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Live Cam</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">16</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hentai</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">5</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Image Boards</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">7</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">AI Adult</p>
                </div>
                <div className="bg-secondary p-4 rounded-xl text-center">
                  <p className="text-3xl font-bold text-destructive mb-1">15</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lainnya</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Daftar Blokir Kustom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Tambahkan situs spesifik yang ingin Anda blokir (contoh: twitter.com, instagram.com).</p>
              
              <form onSubmit={addBlock} className="flex gap-2 mb-4">
                <Input 
                  type="text" 
                  placeholder="facebook.com" 
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="h-10 rounded-xl bg-background"
                  disabled={!isExtensionActive}
                />
                <Button type="submit" className="h-10 rounded-xl" disabled={!isExtensionActive || !newDomain.trim()}>
                  Tambah
                </Button>
              </form>

              <ul className="space-y-2 mb-2">
                {customBlocks.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground p-4 border border-dashed rounded-xl">Belum ada daftar kustom.</p>
                )}
                {customBlocks.map(domain => (
                  <li key={domain} className="flex justify-between items-center bg-background p-2 rounded-lg border border-border">
                    <span className="text-sm">{domain}</span>
                    <span 
                      onClick={() => removeBlock(domain)}
                      className="text-xs bg-muted px-2 py-1 rounded hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                    >
                      Hapus
                    </span>
                  </li>
                ))}
              </ul>
              
              {!isExtensionActive && (
                <p className="text-xs text-destructive mt-3 bg-destructive/5 p-2 rounded-lg border border-destructive/10 leading-relaxed">
                  ⚠️ <strong>Ekstensi Tidak Aktif:</strong> Daftar blokir kustom tidak dapat diproses sampai Ekstensi Pendamping Pulihku dipasang dan aktif di Chrome.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GlobeLock className="w-5 h-5" />
                Safe Search Enforcer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Memaksa Google & Bing ke mode pencarian aman untuk menghindari gambar eksplisit di hasil pencarian.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status Fitur</span>
                {isExtensionActive ? (
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">Aktif via Ekstensi</Badge>
                ) : (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Tidak Aktif</Badge>
                )}
              </div>
              {!isExtensionActive && (
                <p className="text-xs text-destructive bg-destructive/5 p-2 rounded-lg border border-destructive/10 leading-relaxed">
                  ⚠️ Pasang Ekstensi Pendamping Pulihku di Chrome untuk memaksa Safe Search berjalan secara otomatis.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
