"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter as DialogFooterUI } from "@/components/ui/dialog";
import { BookOpen, PlayCircle, Clock } from "lucide-react";

export default function AkademiPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeDialog = () => setActiveModal(null);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Akademi Pulih</h1>
        <p className="text-muted-foreground text-lg">Pahami bagaimana otak bekerja untuk menguasai kendali dirimu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card 
          className="flex flex-col overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setActiveModal('dopamin')}
        >
          <div className="h-48 bg-secondary flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/40" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Cara Kerja Dopamin</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">Pelajari mengapa konten super-stimulasi membajak sistem penghargaan otak dan membuat kita kecanduan.</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 5 Min Baca</span>
            <span className="text-primary font-medium">Baca Artikel &rarr;</span>
          </CardFooter>
        </Card>

        {/* Card 2 */}
        <Card 
          className="flex flex-col overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setActiveModal('trigger')}
        >
          <div className="h-48 bg-primary/10 flex items-center justify-center relative">
            <PlayCircle className="w-16 h-16 text-primary" />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">12:04</div>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Expert Talk about Porn Addiction</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">Video panduan cara memetakan kebiasaan (cue, craving, response, reward).</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4"/> Video Course</span>
          </CardFooter>
        </Card>
        
        {/* Card 3 */}
        <Card 
          className="flex flex-col overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setActiveModal('stres')}
        >
          <div className="h-48 bg-secondary flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/40" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Manajemen Stres & Urge Surfing</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">Teknik mindfulness untuk membiarkan godaan datang dan pergi seperti ombak tanpa harus berselancar di atasnya.</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 8 Min Baca</span>
            <span className="text-primary font-medium">Baca Artikel &rarr;</span>
          </CardFooter>
        </Card>
      </div>

      {/* Modal Dopamin */}
      <Dialog open={activeModal === 'dopamin'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cara Kerja Dopamin</DialogTitle>
            <DialogDescription>Mengapa kita sulit berhenti?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 leading-relaxed mt-4 text-foreground/90">
            <p>Dopamin sering disalahartikan sebagai "hormon kebahagiaan", padahal fungsinya yang sebenarnya adalah hormon <strong>pencarian dan motivasi</strong>.</p>
            <p>Saat Anda mengonsumsi konten pornografi internet berkecepatan tinggi, sirkuit penghargaan otak Anda dibanjiri oleh kadar dopamin yang sangat tinggi (jauh di atas batas normal aktivitas manusia). Otak tidak didesain untuk menangani hiper-stimulasi ini.</p>
            <h3 className="font-semibold text-lg mt-6">Proses Toleransi</h3>
            <p>Akibat banjir dopamin ini, reseptor otak Anda akan mulai "menutup diri" agar tidak kewalahan. Hal ini membuat Anda butuh stimulasi yang lebih kuat, lebih ekstrem, atau lebih lama hanya untuk merasakan efek yang sama. Itulah mengapa Anda merasa terjebak.</p>
            <p>Kabar baiknya? Otak manusia memiliki <em>neuroplastisitas</em>. Berhenti mengonsumsi pemicunya akan memberi otak Anda kesempatan untuk memulihkan reseptor dopamin tersebut ke tingkat normal.</p>
          </div>
          <DialogFooterUI className="mt-6">
            <Button onClick={closeDialog}>Tandai Selesai Dibaca</Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>

      {/* Modal Trigger */}
      <Dialog open={activeModal === 'trigger'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Expert Talk about Porn Addiction (Video)</DialogTitle>
            <DialogDescription>Video Edukasi oleh Pakar</DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full rounded-lg mt-4 overflow-hidden shadow-lg border">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/FyVaFel5Zsw?autoplay=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>
          <DialogFooterUI className="mt-6">
            <Button onClick={closeDialog}>Tutup Video</Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>

      {/* Modal Stres */}
      <Dialog open={activeModal === 'stres'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Manajemen Stres & Urge Surfing</DialogTitle>
            <DialogDescription>Mengendarai ombak godaan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 leading-relaxed mt-4 text-foreground/90">
            <p>Seringkali, pornografi bukanlah tentang gairah seksual itu sendiri, melainkan mekanisme pelarian (<em>coping mechanism</em>) dari emosi negatif seperti stres, kesepian, bosan, atau kecemasan.</p>
            <h3 className="font-semibold text-lg mt-6">Teknik Urge Surfing (Berselancar di Atas Dorongan)</h3>
            <p>Saat dorongan (urge) itu datang, jangan melawannya dengan panik. Dorongan itu seperti ombak di laut. Ia akan mulai kecil, membesar hingga mencapai puncak, dan akhirnya akan pecah dan mereda sendirinya.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Amati:</strong> Sadari di mana tepatnya dorongan itu terasa secara fisik (misal di perut, dada, kepala).</li>
              <li><strong>Bernapas:</strong> Fokuskan perhatian pada keluar masuknya napas Anda. Gunakan napas sebagai papan selancar Anda.</li>
              <li><strong>Biarkan Berlalu:</strong> Jangan bertindak atas dorongan tersebut, tetapi jangan juga menekannya. Cukup amati sampai ia hilang.</li>
            </ul>
          </div>
          <DialogFooterUI className="mt-6">
            <Button onClick={closeDialog}>Tandai Selesai Dibaca</Button>
          </DialogFooterUI>
        </DialogContent>
      </Dialog>

    </div>
  );
}
