"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Heart, Plus, Filter, CornerDownRight, Send, Loader2, X } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  has_liked?: boolean;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
};

export default function KomunitasPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"latest" | "popular">("latest");

  // Create Post Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  // Detail & Comments Modal State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("komunitas_posts")
        .select("*");

      if (filter === "latest") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("likes_count", { ascending: false });
      }

      const { data: postsData, error } = await query;
      if (error) throw error;

      // If user is authenticated, check which posts the user has liked
      if (user && postsData) {
        const { data: likesData, error: likesError } = await supabase
          .from("komunitas_likes")
          .select("post_id")
          .eq("user_id", user.id);

        if (!likesError && likesData) {
          const likedPostIds = new Set(likesData.map((l) => l.post_id));
          const postsWithLikes = postsData.map((post: any) => ({
            ...post,
            has_liked: likedPostIds.has(post.id),
          }));
          setPosts(postsWithLikes);
          return;
        }
      }

      setPosts(postsData || []);
    } catch (error: any) {
      console.error("Gagal memuat postingan:", error);
      toast.error("Gagal memuat postingan komunitas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, user]);

  const handleLike = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    const hasLikedBefore = post.has_liked;
    
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              has_liked: !hasLikedBefore,
              likes_count: hasLikedBefore ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );
    if (selectedPost && selectedPost.id === post.id) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              has_liked: !hasLikedBefore,
              likes_count: hasLikedBefore ? prev.likes_count - 1 : prev.likes_count + 1,
            }
          : null
      );
    }

    try {
      if (hasLikedBefore) {
        // Unlike
        const { error: deleteError } = await supabase
          .from("komunitas_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;
      } else {
        // Like
        const { error: insertError } = await supabase
          .from("komunitas_likes")
          .insert({ post_id: post.id, user_id: user.id });

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error("Gagal menyukai postingan:", err);
      // Revert optimistic update on failure
      fetchPosts();
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sesi pengguna tidak ditemukan.");
      return;
    }
    if (!newContent.trim()) {
      toast.warning("Konten postingan tidak boleh kosong.");
      return;
    }

    setIsPosting(true);
    try {
      const authorName = isAnonymous ? "Pejuang Anonim" : user.name;
      const authorAvatar = isAnonymous ? "👤" : (user.avatar || "🌱");

      const { data, error } = await supabase
        .from("komunitas_posts")
        .insert({
          user_id: user.id,
          author_name: authorName,
          author_avatar: authorAvatar,
          content: newContent.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Postingan berhasil dikirim!");
      setNewContent("");
      setIsCreateOpen(false);
      fetchPosts();
    } catch (err: any) {
      console.error("Gagal mengirim postingan:", err);
      toast.error(err.message || "Gagal membuat postingan.");
    } finally {
      setIsPosting(false);
    }
  };

  const openPostDetail = async (post: Post) => {
    setSelectedPost(post);
    setIsLoadingComments(true);
    setComments([]);
    try {
      const { data, error } = await supabase
        .from("komunitas_comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      console.error("Gagal memuat komentar:", err);
      toast.error("Gagal memuat komentar.");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost) return;
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const authorName = "Pejuang Anonim";
      const authorAvatar = "👤";

      const { data, error } = await supabase
        .from("komunitas_comments")
        .insert({
          post_id: selectedPost.id,
          user_id: user.id,
          author_name: authorName,
          author_avatar: authorAvatar,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update local comment list
      setComments((prev) => [...prev, data]);
      setNewComment("");

      // Update comments count in posts list and selectedPost
      const updatedCommentsCount = selectedPost.comments_count + 1;
      setSelectedPost((prev) => prev ? { ...prev, comments_count: updatedCommentsCount } : null);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id ? { ...p, comments_count: updatedCommentsCount } : p
        )
      );

      toast.success("Komentar terkirim!");
    } catch (err: any) {
      console.error("Gagal mengirim komentar:", err);
      toast.error("Gagal mengirim komentar.");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-6 pb-24 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">Komunitas Anonim</h1>
          <p className="text-muted-foreground text-sm">Bagikan perjuangan, tips, dan kemenangan secara anonim.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("latest")}
            className="rounded-full text-xs font-semibold"
          >
            Terbaru
          </Button>
          <Button
            variant={filter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("popular")}
            className="rounded-full text-xs font-semibold"
          >
            Terpopuler
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Memuat cerita pejuang...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl p-8 bg-secondary/15">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-bold text-foreground">Belum ada postingan</h4>
            <p className="text-muted-foreground text-xs mt-1">Jadilah yang pertama untuk membagikan ceritamu!</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="border border-border/80 shadow-sm rounded-3xl hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
              onClick={() => openPostDetail(post)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-lg border">
                    {post.author_avatar}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{post.author_name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(parseISO(post.created_at), { addSuffix: true, locale: localeID })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium whitespace-pre-line line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 pt-3 text-muted-foreground text-xs font-semibold">
                      <button
                        className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${
                          post.has_liked ? "text-red-500" : ""
                        }`}
                        onClick={(e) => handleLike(post, e)}
                      >
                        <Heart className={`w-4 h-4 ${post.has_liked ? "fill-current" : ""}`} /> {post.likes_count}
                      </button>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" /> {post.comments_count}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all z-40 bg-primary text-foreground"
        onClick={() => setIsCreateOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* CREATE POST MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg rounded-3xl border border-border/80 shadow-lg animate-in zoom-in-95 duration-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground">Bagikan Ceritamu</h3>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCreateOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <Textarea
                  placeholder="Ceritakan perjuangan, kemenangan, atau tantangan yang kamu hadapi..."
                  className="min-h-[140px] rounded-2xl p-4 bg-secondary/20"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  disabled={isPosting}
                />
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anon"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <label htmlFor="anon" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                      Posting Anonim (Pejuang Anonim)
                    </label>
                  </div>
                  <Button type="submit" className="rounded-full px-6 text-xs font-bold" disabled={isPosting || !newContent.trim()}>
                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Kirim
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DETAIL POST & COMMENTS MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl h-[85vh] rounded-3xl border border-border/80 shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-card">
              <h3 className="font-bold text-sm text-foreground">Detail Postingan</h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedPost(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Original Post */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-lg border">
                  {selectedPost.author_avatar}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{selectedPost.author_name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(parseISO(selectedPost.created_at), { addSuffix: true, locale: localeID })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedPost.content}
                  </p>
                  <div className="flex items-center gap-6 pt-3 text-muted-foreground text-xs font-semibold">
                    <button
                      className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${
                        selectedPost.has_liked ? "text-red-500" : ""
                      }`}
                      onClick={(e) => handleLike(selectedPost, e)}
                    >
                      <Heart className={`w-4 h-4 ${selectedPost.has_liked ? "fill-current" : ""}`} /> {selectedPost.likes_count}
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> {selectedPost.comments_count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/80 pt-4">
                <h4 className="font-bold text-xs text-foreground mb-4">Komentar ({comments.length})</h4>
                
                {isLoadingComments ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Memuat komentar...</span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-6">Belum ada komentar. Tulis komentar pertama!</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 pl-4">
                        <CornerDownRight className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-1" />
                        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-sm border shrink-0">
                          {comment.author_avatar}
                        </div>
                        <div className="flex-1 bg-secondary/20 rounded-2xl p-3 border border-border/40">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[11px] text-foreground">{comment.author_name}</span>
                            <span className="text-[9px] text-muted-foreground">
                              {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true, locale: localeID })}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/90 font-medium whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Input Footer */}
            <div className="p-4 border-t bg-card">
              <form onSubmit={handleSendComment} className="flex gap-2">
                <Input
                  placeholder="Tulis tanggapan anonim..."
                  className="rounded-full px-4 text-xs h-10"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isCommenting}
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0 h-10 w-10" disabled={!newComment.trim() || isCommenting}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

