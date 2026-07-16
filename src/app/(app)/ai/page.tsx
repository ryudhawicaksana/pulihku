"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/user-provider";

type Message = {
  id: number;
  role: "ai" | "user";
  content: string;
};

export default function AIPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount/user change
  useEffect(() => {
    if (!user) return;
    const storageKey = `pulihku_ai_messages_${user.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal memuat riwayat obrolan:", e);
      }
    } else {
      setMessages([
        {
          id: 1,
          role: "ai",
          content: `Halo! Aku AI Sahabat Pulih. Aku di sini untuk mendukungmu, ${user.name}. Apa yang sedang kamu rasakan hari ini? Jika kamu sedang merasakan dorongan yang kuat, beri tahu aku.`,
        }
      ]);
    }
  }, [user]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      const storageKey = `pulihku_ai_messages_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses obrolan.");
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: data.text,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("AI chat error:", error);
      toast.error(error.message || "Gagal terhubung ke AI. Menampilkan respons lokal cadangan.");
      
      // Fallback response if API fails/is not configured
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          role: "ai",
          content: "Maaf, saat ini koneksi ke server AI terputus. Tetaplah bernapas dalam-dalam, alihkan fokusmu dengan minum air putih atau lakukan olahraga ringan sejenak. Aku tetap mendukungmu!",
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Apakah kamu yakin ingin menghapus semua riwayat percakapan dengan AI?")) {
      const initialMessage: Message = {
        id: 1,
        role: "ai",
        content: "Halo! Aku AI Sahabat Pulih. Aku di sini untuk mendukungmu. Apa yang sedang kamu rasakan hari ini? Jika kamu sedang merasakan dorongan yang kuat, beri tahu aku.",
      };
      setMessages([initialMessage]);
      localStorage.setItem("pulihku_ai_messages", JSON.stringify([initialMessage]));
      toast.success("Riwayat percakapan berhasil dihapus.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Sahabat Pulih</h1>
          <p className="text-muted-foreground text-lg">Asisten pribadi yang siap mendengar dan membantu tanpa menghakimi.</p>
        </div>
        {messages.length > 1 && (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full text-destructive border-destructive/20 hover:bg-destructive/10"
            onClick={handleClearHistory}
            title="Hapus Riwayat Chat"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
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
              <div className={`p-4 rounded-2xl text-foreground whitespace-pre-wrap ${
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

