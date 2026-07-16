"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, Bot, Users, Shield, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Jejak", href: "/jejak", icon: Activity },
  { name: "AI", href: "/ai", icon: Bot, isAction: true },
  { name: "Komunitas", href: "/komunitas", icon: Users },
  { name: "Toko", href: "/toko", icon: ShoppingBag },
];

export function MobileNav() {
  const currentPath = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-20 px-2 pb-safe">
        {mobileItems.map((item, idx) => {
          const isActive = currentPath === item.href;
          
          if (item.isAction) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 bg-background border border-white/20 rounded-2xl flex items-center justify-center shadow-lg hover:bg-white/5 transition-colors">
                  <item.icon className="w-6 h-6 text-foreground/80" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
