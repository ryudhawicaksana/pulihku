"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Loader2 } from "lucide-react";

type Message = {
  id: number;
  role: "ai" | "user";
  content: string;
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content: "Halo! Aku AI Sahabat Pulih. Aku di sini untuk mendukungmu. Apa yang sedang kamu rasakan hari ini? Jika kamu sedang merasakan dorongan yang kuat, beri tahu aku.",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      let aiResponseText = "Aku mengerti dan aku selalu ada di sini untuk mendengarkan. Teruslah berjuang langkah demi langkah!";
      const lowerInput = userMessage.content.toLowerCase();
      
      if (lowerInput.includes("stres") || lowerInput.includes("berat") || lowerInput.includes("pusing")) {
        aiResponseText = "Stres memang sering menjadi pemicu utama. Mari kita ambil napas sejenak. Tarik napas dalam 4 hitungan, tahan 4 hitungan, dan buang perlahan. Apakah kamu ingin mencoba teknik relaksasi cepat bersamaku?";
      } else if (lowerInput.includes("relapse") || lowerInput.includes("jatuh") || lowerInput.includes("gagal")) {
        aiResponseText = "Tidak apa-apa, setiap perjalanan pasti ada kerikilnya. Jangan terlalu keras pada dirimu sendiri. Ingat, sebuah relapse tidak menghapus semua progres yang telah kamu buat. Apa yang membuatmu terpicu kali ini?";
      } else if (lowerInput.includes("halo") || lowerInput.includes("hai") || lowerInput.includes("pagi")) {
        aiResponseText = "Halo! Sangat senang mendengarmu. Bagaimana kabarmu hari ini?";
      } else if (lowerInput.includes("godaan") || lowerInput.includes("ingin") || lowerInput.includes("pengen")) {
        aiResponseText = "Tarik napas dalam-dalam. Godaan itu seperti ombak yang datang, dan pasti akan pergi lagi. Jangan dilawan, cukup diamati. Ayo lakukan push-up 10x atau minum segelas air sekarang juga untuk memecah fokusmu!";
      } else if (lowerInput.includes("level") || lowerInput.includes("tingkat")) {
        if (lowerInput.includes("tertinggi") || lowerInput.includes("maksimal") || lowerInput.includes("paling tinggi")) {
          aiResponseText = "Level tertinggi di Pulihku adalah **Hutan Raksasa**. Dibutuhkan streak lebih dari 365 hari (1 tahun) tanpa henti untuk mencapainya. Di tahap ini, fondasi otakmu sudah benar-benar terbentuk baru!";
        } else {
          aiResponseText = "Di Pulihku ada 5 tahapan level: Benih (0-7 hari), Tunas (8-30 hari), Akar Kuat (31-90 hari), Pohon Kokoh (91-365 hari), dan Hutan Raksasa (>365 hari). Kamu saat ini di level Benih. Terus bertumbuh ya!";
        }
      } else if (lowerInput.includes("fitur") || lowerInput.includes("pulihku")) {
        aiResponseText = "Pulihku punya beberapa fitur andalan untukmu: Jejak Pulih (untuk melacak hari), Akademi (untuk belajar neurosains kecanduan), Komunitas (berbagi secara anonim), Safe Browse (memblokir situs), dan tentu saja aku, AI Sahabatmu!";
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: aiResponseText,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Sahabat Pulih</h1>
        <p className="text-muted-foreground text-lg">Asisten pribadi yang siap mendengar dan membantu tanpa menghakimi.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "self-end flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-primary" : "bg-primary/20"
              }`}>
                {msg.role === "user" ? (
                  <User className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Bot className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className={`p-4 rounded-2xl text-foreground ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-secondary rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div className="bg-secondary p-4 rounded-2xl rounded-tl-sm text-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Mengetik...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t border-border bg-card">
          <form className="flex gap-2" onSubmit={handleSend}>
            <Input 
              placeholder="Ceritakan apa yang kamu rasakan..." 
              className="rounded-full h-12 px-6" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-full shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
