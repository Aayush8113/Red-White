import React from 'react';

export const Logo = ({ className = "w-8 h-8", glow = true }) => {
  return (
    <div className={`relative ${className} group`}>
      {}
      {glow && (
        <div className="absolute inset-0 bg-indigo-500/25 rounded-xl blur-md group-hover:bg-indigo-500/40 transition-all duration-500 scale-90" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_2px_10px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300"
      >
        {}
        <polygon
          points="50,8 88,30 88,70 50,92 12,70 12,30"
          stroke="url(#logo-grad-1)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(15, 23, 42, 0.75)"
        />
        {}
        <path
          d="M50 22 L26 70 M50 22 L74 70 M34 50 L66 50"
          stroke="url(#logo-grad-2)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {}
        <circle cx="50" cy="22" r="5" fill="#f472b6" className="animate-pulse" />
        <circle cx="26" cy="70" r="5" fill="#818cf8" />
        <circle cx="74" cy="70" r="5" fill="#818cf8" />
        <circle cx="34" cy="50" r="4.5" fill="#c084fc" />
        <circle cx="66" cy="50" r="4.5" fill="#c084fc" />

        <defs>
          <linearGradient id="logo-grad-1" x1="12" y1="8" x2="88" y2="92">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="logo-grad-2" x1="34" y1="22" x2="66" y2="70">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
