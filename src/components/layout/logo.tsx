import React from "react";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className="hover:opacity-95 transition-opacity">
      <span className={`font-extrabold text-2xl tracking-tighter text-foreground select-none ${className}`}>
        pulihku<span className="text-primary font-extrabold">.</span>
      </span>
    </Link>
  );
}
