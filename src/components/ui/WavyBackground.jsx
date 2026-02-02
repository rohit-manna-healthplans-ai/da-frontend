import React from "react";

export default function WavyBackground() {
  return (
    <div className="iw-bg-waves" aria-hidden="true">
      <svg viewBox="0 0 1200 800" style={{ animation: "iwFloat1 16s ease-in-out infinite" }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--wave-a)" />
            <stop offset="55%" stopColor="var(--wave-b)" />
            <stop offset="100%" stopColor="var(--wave-c)" />
          </linearGradient>
        </defs>
        <path
          d="M0,520 C180,440 300,620 520,520 C720,430 860,560 1040,500 C1120,472 1160,460 1200,450 L1200,800 L0,800 Z"
          fill="url(#g1)"
        />
      </svg>

      <svg viewBox="0 0 1200 800" style={{ animation: "iwFloat2 20s ease-in-out infinite" }}>
        <defs>
          <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--wave-d)" />
            <stop offset="55%" stopColor="var(--wave-a)" />
            <stop offset="100%" stopColor="var(--wave-e)" />
          </linearGradient>
        </defs>
        <path
          d="M0,610 C220,520 360,700 560,610 C740,530 920,660 1100,590 C1140,575 1180,560 1200,550 L1200,800 L0,800 Z"
          fill="url(#g2)"
        />
      </svg>

      <svg
        viewBox="0 0 1200 800"
        style={{ animation: "iwDrift 22s ease-in-out infinite alternate", opacity: 0.35 }}
      >
        <defs>
          <linearGradient id="g3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--wave-f)" />
            <stop offset="55%" stopColor="var(--wave-a)" />
            <stop offset="100%" stopColor="var(--wave-g)" />
          </linearGradient>
        </defs>
        <path
          d="M0,460 C160,420 300,520 520,460 C740,400 880,520 1060,460 C1120,440 1160,420 1200,410 L1200,800 L0,800 Z"
          fill="url(#g3)"
        />
      </svg>
    </div>
  );
}
