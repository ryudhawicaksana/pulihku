"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Share2, Flame, Send } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "sonner";

type Comment = {
  id: number;
  author: string;
  content: string;
};

type Post = {
  id: number;
  author: string;
  streak: number;
  time: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
};

export default function KomunitasPage() {
  const { user } = useUser();
  const currentStreak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Pejuang #892",
      streak: 45,
      time: "2 jam yang lalu",
      content: "Hari ini genap 45 hari. Sempat ada dorongan kuat semalam karena stres kerjaan, tapi berkat tombol SOS dan latihan napas, saya bisa melewati malam itu tanpa relapse. Tetap semangat semuanya!",
      likes: 24,
      comments: [
        { id: 1, author: "Pejuang #221", content: "Luar biasa! Lanjutkan perjuanganmu." },
        { id: 2, author: "Pejuang #901", content: "Wah ini sangat memotivasi, terima kasih sudah berbagi." }
      ]
    },
    {
      id: 2,
      author: "Pejuang #104",
      streak: 3,
      time: "5 jam yang lalu",
      content: "Jatuh lagi kemarin setelah 12 hari bertahan. Rasanya kecewa banget sama diri sendiri. Tapi saya menolak menyerah. Hari ini adalah hari ke-3, kembali membangun fondasi. Mohon doanya kawan-kawan.",
      likes: 56,
      comments: [
        { id: 3, author: "Pejuang #009", content: "Gagal itu wajar, yang penting adalah kemauan untuk bangkit lagi." }
      ]
    }
  ]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const [activePost, setActivePost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isCurrentlyLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: `Pejuang #${Math.floor(Math.random() * 900) + 100}`, // random id
      streak: currentStreak,
      time: "Baru saja",
      content: newPostContent,
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setIsWriteModalOpen(false);
    toast.success("Cerita Anda berhasil dibagikan secara anonim.");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activePost) return;

    const comment: Comment = {
      id: Date.now(),
      author: `Pejuang #${Math.floor(Math.random() * 900) + 100}`,
      content: newComment
    };

    setPosts(posts.map(p => {
      if (p.id === activePost.id) {
        return {
          ...p,
          comments: [...p.comments, comment]
        };
      }
      return p;
    }));

    // Update active post to reflect the new comment instantly in the modal
    setActivePost({
      ...activePost,
      comments: [...activePost.comments, comment]
    });

    setNewComment("");
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Komunitas</h1>
          <p className="text-muted-foreground text-lg">Kamu tidak berjuang sendirian. Bagikan ceritamu secara anonim.</p>
        </div>
        <Button 
          className="w-full md:w-auto h-12 rounded-xl px-8 shadow-md"
          onClick={() => setIsWriteModalOpen(true)}
        >
          Tulis Cerita
        </Button>
      </div>

      <div className="max-w-2xl w-full mx-auto space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                    {post.author.split('#')[1]?.substring(0,2)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{post.author}</CardTitle>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <Flame className="w-4 h-4" /> {post.streak} Hari
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{post.content}</p>
              
              <div className="flex items-center gap-6 mt-6 text-muted-foreground">
                <button 
                  className={`flex items-center gap-2 hover:text-primary transition-colors ${post.isLiked ? 'text-rose-500' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                  onClick={() => setActivePost(post)}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments.length}</span>
                </button>
                <button 
                  className="flex items-center gap-2 hover:text-primary transition-colors ml-auto"
                  onClick={() => toast.success("Tautan cerita telah disalin.")}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Tulis Cerita */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tulis Cerita Anonim</DialogTitle>
            <DialogDescription>
              Bagikan perjuangan, keluh kesah, atau kemenanganmu hari ini. Identitasmu tidak akan dipublikasikan.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea 
              placeholder="Ceritakan sesuatu..." 
              className="min-h-[150px] resize-none"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsWriteModalOpen(false)}>Batal</Button>
            <Button onClick={handlePostSubmit} disabled={!newPostContent.trim()}>Bagikan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Komentar */}
      <Dialog open={activePost !== null} onOpenChange={(open) => !open && setActivePost(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Komentar</DialogTitle>
          </DialogHeader>
          
          {activePost && (
            <>
              {/* Post Asli */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                    {activePost.author.split('#')[1]?.substring(0,2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{activePost.author}</h4>
                  </div>
                </div>
                <p className="text-sm text-foreground/90">{activePost.content}</p>
              </div>

              {/* List Komentar */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {activePost.comments.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm my-8">Belum ada komentar. Jadilah yang pertama!</p>
                ) : (
                  activePost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                        {comment.author.split('#')[1]?.substring(0,2)}
                      </div>
                      <div className="bg-secondary p-3 rounded-xl rounded-tl-sm w-full">
                        <h5 className="font-semibold text-xs mb-1">{comment.author}</h5>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Tambah Komentar */}
              <form className="flex gap-2 pt-2" onSubmit={handleCommentSubmit}>
                <Input 
                  placeholder="Tulis balasan anonim..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
