"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter as DialogFooterUI } from "@/components/ui/dialog";
import { BookOpen, PlayCircle, Clock, Zap, Heart, ShieldAlert, Award, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AkademiPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeDialog = () => setActiveModal(null);

  const articles = [
    {
      id: "brain_damage",
      title: "Penceutan Prefrontal Cortex: Bagaimana Pornografi Merusak Fisik Otak",
      desc: "Studi neurosains terbaru menunjukkan atrofi materi abu-abu pada otak akibat konsumsi pornografi yang berlebihan.",
      time: "8 Min Baca",
      category: "Sains & Neurosains",
      icon: ShieldAlert,
      content: (
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>Penelitian dari <strong>Max Planck Institute for Human Development</strong> menunjukkan korelasi negatif yang jelas antara volume materi abu-abu di wilayah <em>Striatum</em> otak dengan durasi menonton pornografi.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">1. Kerusakan Prefrontal Cortex (PFC)</h4>
          <p>PFC adalah pusat eksekutif otak yang mengendalikan moralitas, pengambilan keputusan, empati, dan kendali impuls. Konsumsi pornografi berlebihan membanjiri PFC dengan stimulasi buatan yang ekstrem, yang lama kelamaan menyebabkan sirkuit ini mengalami kemunduran fungsi mirip penderita cedera otak traumatis.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">2. Hipofrontalitas & Kehilangan Kontrol</h4>
          <p>Ketika PFC menyusut, Anda masuk ke dalam kondisi <em>hipofrontalitas</em>, di mana dorongan instan mendominasi nalar logis Anda. Anda akan merasa sadar bahwa perbuatan tersebut buruk, tetapi tidak memiliki daya rem fisik pada sirkuit saraf untuk menghentikannya.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">3. Cara Membalikkan Kerusakan</h4>
          <p>Melalui proses <strong>Neuroplastisitas</strong>, otak dapat menyembuhkan materi abu-abu yang menyusut. Dengan komitmen pantang total selama 30 hingga 90 hari, prefrontal cortex akan perlahan-lahan meregenerasi dendrit sarafnya dan memulihkan kekuatan kendali diri Anda.</p>
        </div>
      )
    },
    {
      id: "dopamine_detox",
      title: "Sains Dopamin: Memulihkan Reseptor Yang Kebas",
      desc: "Panduan praktis melakukan reset dopamin untuk mengembalikan kebahagiaan dari aktivitas sederhana sehari-hari.",
      time: "6 Min Baca",
      category: "Dopamin & Pemulihan",
      icon: Zap,
      content: (
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>Dopamin bukanlah hormon kesenangan, melainkan hormon **ekspektasi dan motivasi**. Ia dilepaskan saat otak memprediksi akan mendapatkan hadiah instan.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">1. Jebakan Novelty Tanpa Batas</h4>
          <p>Pornografi internet menawarkan kebaruan visual (*novelty*) tanpa batas dalam hitungan detik. Otak purba kita salah mengartikan ini sebagai keberhasilan biologis ekstrem, melepaskan banjir dopamin ratusan kali lipat di atas batas normal.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">2. Desensitisasi Reseptor</h4>
          <p>Untuk melestarikan keseimbangan kimiawi (*homeostasis*), otak akan memotong atau menumpulkan reseptor dopaminnya. Akibatnya, Anda menjadi kebas secara emosional. Aktivitas normal seperti olahraga, belajar, bersosialisasi, atau melihat pemandangan alam tidak lagi memicu kegembiraan karena stimulasi dasarnya terlalu rendah.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">3. Strategi Reset Dopamin</h4>
          <p>Untuk menormalkan sensitivitas reseptor dopamin:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Lakukan detoks rangsangan ekstrem selama minimal 14-30 hari.</li>
            <li>Gantikan stimulasi digital instan dengan kesenangan yang memerlukan usaha fisik (olahraga, membaca buku cetak, menulis jurnal).</li>
            <li>Terima rasa bosan awal sebagai tanda bahwa reseptor otak Anda sedang dalam proses penyembuhan dan pembersihan.</li>
          </ul>
        </div>
      )
    },
    {
      id: "heal_methods",
      title: "Metode Terapi Urge Surfing: Kunci Utama Mengatasi Craving",
      desc: "Gunakan teknik klinis kognitif (CBT) untuk berselancar di atas dorongan hasrat pornografi tanpa hanyut tenggelam.",
      time: "7 Min Baca",
      category: "Metode & Terapi",
      icon: Heart,
      content: (
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>Urge Surfing adalah teknik terapi kognitif perilaku (CBT) yang dipelopori oleh Dr. Alan Marlatt. Teknik ini didasarkan pada pemahaman bahwa dorongan kecanduan mirip dengan ombak laut.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">1. Anatomi Gelombang Dorongan</h4>
          <p>Dorongan atau hasrat untuk menonton pornografi tidak bertahan selamanya. Dorongan tersebut akan naik perlahan, mencapai puncak intensitas yang luar biasa dalam waktu 10-15 menit, lalu pecah dan surut secara alami jika tidak diberi stimulus tambahan.</p>
          <h4 className="font-extrabold text-sm text-foreground uppercase mt-4">2. Tiga Langkah Utama Berselancar:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Sadar & Deteksi:</strong> Tarik napas, akui dorongan tersebut tanpa menghakimi diri sendiri. Katakan: "Saya sedang merasakan dorongan kuat di dada saya saat ini."</li>
            <li><strong>Fokus pada Fisik:</strong> Cari tahu di mana dorongan itu menetap di tubuh Anda (otot tegang, napas pendek, atau gelisah). Perhatikan sensasi itu seolah Anda adalah ilmuwan yang sedang mengobservasi.</li>
            <li><strong>Bernapas sebagai Papan Selancar:</strong> Lakukan pernapasan diafragma yang lambat. Bayangkan napas Anda adalah papan selancar yang menjaga Anda tetap stabil di puncak ombak dorongan tersebut.</li>
          </ol>
        </div>
      )
    }
  ];

  const videos = [
    {
      id: "video1",
      title: "The Great Porn Experiment - Gary Wilson (TEDx)",
      desc: "Video edukasi legendaris yang membedah dampak biologis pornografi modern terhadap otak pejuang muda.",
      url: "https://www.youtube.com/embed/wSF82AwSDiU?autoplay=0",
      duration: "16:29"
    },
    {
      id: "video2",
      title: "Your Brain on Porn: Neurobiology of Addiction",
      desc: "Penjelasan profesional medis mengenai bagaimana kecanduan visual merusak jalur saraf dopamin dan prefrontal cortex.",
      url: "https://www.youtube.com/embed/FyVaFel5Zsw?autoplay=0",
      duration: "1:56"
    }
  ];

  const shiftingTips = [
    {
      title: "Mandi Air Dingin (Cold Shower)",
      desc: "Terbukti ilmiah memicu pelepasan dopamin dasar hingga 250% yang bertahan stabil selama berjam-jam tanpa memicu kecanduan, sekaligus menurunkan suhu tubuh untuk memotong dorongan nafsu seketika.",
      reward: "+15 XP"
    },
    {
      title: "Olahraga Intensitas Tinggi (HIIT)",
      desc: "Lakukan burpee, push-up, atau sprint pendek selama 3-5 menit ketika hasrat melanda. Pengalihan energi fisik ini memaksa aliran darah menuju otot besar dan menjauhkan fokus mental dari fantasi.",
      reward: "+10 XP"
    },
    {
      title: "Pernapasan Diafragma 4-7-8",
      desc: "Tarik napas 4 detik, tahan 7 detik, dan embuskan perlahan 8 detik. Ulangi 4 kali untuk memicu sistem saraf parasimpatik yang menenangkan kepanikan pikiran saat mengalami sakau dopamin digital.",
      reward: "+25 XP"
    }
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header Section */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">PUSAT PENDIDIKAN & ILMIAH</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Akademi Pulih</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pelajari riset neurosains medis dan panduan profesional untuk mereklamasi kendali atas sirkuit dopamin otak Anda.
        </p>
      </div>

      {/* SECTION 1: PAPERS & ARTICLES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-extrabold tracking-tight">Karya Ilmiah & Artikel Pemulihan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => {
            const IconComponent = art.icon;
            return (
              <Card 
                key={art.id}
                className="flex flex-col overflow-hidden border border-border/80 shadow-sm rounded-3xl hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setActiveModal(art.id)}
              >
                <div className="h-44 bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                  <IconComponent className="w-14 h-14 text-muted-foreground/60 transition-transform group-hover:scale-110 duration-300" />
                  <Badge className="absolute top-3 left-3 bg-background border text-[9px] font-black uppercase text-foreground py-0.5 px-2.5">
                    {art.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {art.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {art.desc}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-[10px] text-muted-foreground font-bold border-t border-border/40 pt-3 pb-3 bg-secondary/20">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {art.time}</span>
                  <span className="text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">Baca Selengkapnya <ArrowUpRight className="w-3 h-3" /></span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: VIDEO COURSE */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <PlayCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-extrabold tracking-tight">Video Edukasi Pakar Profesional</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <Card 
              key={vid.id}
              className="flex flex-col md:flex-row overflow-hidden border border-border/80 shadow-sm rounded-3xl hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setActiveModal(vid.id)}
            >
              <div className="md:w-48 h-40 bg-primary/10 flex items-center justify-center relative shrink-0">
                <PlayCircle className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                <Badge className="absolute bottom-2 right-2 bg-black/75 text-white border-none font-bold text-[9px]">
                  {vid.duration}
                </Badge>
              </div>
              <div className="flex flex-col justify-between p-5">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                    {vid.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    {vid.desc}
                  </p>
                </div>
                <p className="text-[10px] text-primary font-bold mt-3">Putar Video Course &rarr;</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 3: SHIFTING TIPS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-extrabold tracking-tight">Tips Melatih Diri & Latihan Pengalihan (Shifting)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shiftingTips.map((tip, idx) => (
            <Card key={idx} className="border border-border/80 shadow-sm rounded-3xl bg-secondary/15 relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-sm font-bold text-foreground">{tip.title}</CardTitle>
                  <Badge className="bg-primary/20 text-foreground text-[9px] font-black py-0 px-2 shrink-0">
                    {tip.reward} Bonus
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {tip.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DYNAMIC DIALOGS */}
      {articles.map((art) => (
        <Dialog 
          key={art.id} 
          open={activeModal === art.id} 
          onOpenChange={(open) => !open && closeDialog()}
        >
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-none rounded-3xl text-foreground">
            <DialogHeader>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{art.category}</span>
              <DialogTitle className="text-2xl font-black mt-1 leading-snug">{art.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">Estimasi baca: {art.time}</DialogDescription>
            </DialogHeader>
            <div className="mt-6 border-t pt-4">
              {art.content}
            </div>
            <DialogFooterUI className="mt-6">
              <Button onClick={closeDialog} className="rounded-xl font-bold bg-primary text-foreground hover:bg-primary/95">
                Selesai Membaca
              </Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
      ))}

      {videos.map((vid) => (
        <Dialog 
          key={vid.id} 
          open={activeModal === vid.id} 
          onOpenChange={(open) => !open && closeDialog()}
        >
          <DialogContent className="sm:max-w-3xl bg-card border-none rounded-3xl text-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{vid.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">{vid.desc}</DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full rounded-2xl mt-4 overflow-hidden shadow-lg border border-border/60">
              <iframe 
                width="100%" 
                height="100%" 
                src={vid.url} 
                title={vid.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
              </iframe>
            </div>
            <DialogFooterUI className="mt-6">
              <Button onClick={closeDialog} className="rounded-xl font-bold">Tutup Video</Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
      ))}

    </div>
  );
}
