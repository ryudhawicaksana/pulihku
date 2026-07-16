"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Activity, 
  Bot, 
  BookOpen, 
  Users, 
  Shield,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { Logo } from "@/components/layout/logo";
import { getRankDetails } from "@/lib/ranks";

const navItems = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Jejak Pulih", href: "/jejak", icon: Activity },
  { name: "AI Sahabat", href: "/ai", icon: Bot },
  { name: "Akademi", href: "/akademi", icon: BookOpen },
  { name: "Komunitas", href: "/komunitas", icon: Users },
  { name: "Toko Pejuang", href: "/toko", icon: ShoppingBag },
  { name: "Safe Browse", href: "/safe-browse", icon: Shield },
];

export function Sidebar() {
  const currentPath = usePathname();
  const { user } = useUser();
  
  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;
  const { rankName } = getRankDetails(user?.xp, streak);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card px-4 pt-6 pb-10 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 px-2 mb-8">
        <Logo />
      </div>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link href="/profil" className="block transition-transform hover:scale-105 active:scale-95">
          <div className="bg-secondary p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-transparent hover:border-primary/20">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-1 shadow-sm">
              <span className="text-xl">{user?.avatar || "🌱"}</span>
            </div>
            <h4 className="font-semibold text-sm">Level: {rankName}</h4>
            <p className="text-xs text-muted-foreground">Klik untuk lihat profil</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
