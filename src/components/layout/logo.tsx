import React from "react";

export function Logo({ className = "w-8 h-8", color = "#b8d535" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stem/Vine representing 'P' */}
      <path
        d="M 18 85 
           C 14 85, 14 70, 22 62 
           C 30 54, 46 50, 54 50 
           C 72 50, 86 35, 86 18 
           C 86 1, 54 1, 42 18 
           C 30 35, 22 54, 18 85 Z"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Leaf */}
      <path
        d="M 46 45 
           C 46 29, 62 17, 78 17 
           C 78 33, 62 45, 46 45 Z"
        fill={color}
      />
      {/* Inner Leaf Vein */}
      <path
        d="M 46 45 C 57 36, 68 26, 78 17"
        stroke="#9cb927"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
