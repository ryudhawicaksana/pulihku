"use client";

import { useState } from "react";
import { MessageSquare, Heart, BarChart2, Plus, Filter } from "lucide-react";
import Image from "next/image";

type Comment = {
  id: number;
  author: string;
  content: string;
};

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
};

export default function KomunitasPage() {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      author: "Hunter Hersey",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Random avatar placeholder
      time: "2 hr ago",
      title: "Reading People's story's",
      content: "When I can I go on this tab and start reading the posts. it helps me know that I'm not alone in this journey and how people are getting over porn addiction. It also helps co...",
      likes: 6,
      comments: 1,
      views: 201,
    },
    {
      id: 2,
      author: "Gabriel",
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d", 
      time: "1 hr ago",
      title: "Day 278 - Flatlines?",
      content: "As you go you will experience flatlines. You need to overcome these by just sticking to it.",
      likes: 5,
      comments: 1,
      views: 127,
    },
    {
      id: 3,
      author: "bolton",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      time: "2 hr ago",
      title: "feeling great",
      content: "i haven't done anything out of order in almost a month, longer than i have ever. feeling amazing and my confidence and mental has improved so much. ...",
      likes: 12,
      comments: 4,
      views: 430,
    }
  ]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-8 pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Community</h1>
          <p className="text-xl text-foreground/80">Meet like-minded people.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
             <div className="w-4 h-4 border-2 border-white/70 rounded-full flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />
             </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/70"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background" />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/70"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button className="flex items-center gap-2 text-sm text-white/70 font-medium">
          <Filter className="w-4 h-4" /> Filter: Popular <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-5 px-5">
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border-b border-white/10 pb-6 last:border-0">
              <div className="flex gap-4">
                <div className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-bold text-white mr-2">{post.author}</span>
                      <span className="text-white/40 text-sm">· {post.time}</span>
                    </div>
                    <button className="text-white/40 hover:text-white transition-colors">
                      <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="2" cy="2" r="2" fill="currentColor"/>
                        <circle cx="8" cy="2" r="2" fill="currentColor"/>
                        <circle cx="14" cy="2" r="2" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">
                    {post.content}
                  </p>
                  <button className="text-white/40 text-sm mb-4 hover:text-white transition-colors">See more</button>
                  
                  <div className="flex items-center gap-6 text-white/50 text-sm font-medium">
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <BarChart2 className="w-4 h-4" /> {post.views}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all z-40">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
