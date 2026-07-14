import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold text-2xl tracking-tighter text-foreground select-none ${className}`}>
      pulihku<span className="text-primary font-extrabold">.</span>
    </span>
  );
}
