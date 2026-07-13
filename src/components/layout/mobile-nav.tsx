"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, Bot, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Jejak", href: "/jejak", icon: Activity },
  { name: "AI", href: "/ai", icon: Bot },
  { name: "Safe", href: "/safe-browse", icon: Shield },
];

export function MobileNav() {
  const currentPath = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
