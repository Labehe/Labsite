"use client";

import * as React from "react";
import { ArrowDown, Check, Sparkles } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  x: number; // percentage on desktop
  y: number;
}

const NETWORK_NODES: NodeData[] = [
  { id: "environment", label: "ENVIRONMENT", sublabel: "Aquatic & Soil Matrices", x: 14, y: 22 },
  { id: "contaminant", label: "CONTAMINANT", sublabel: "Microplastics & PFAS", x: 42, y: 16 },
  { id: "exposure", label: "EXPOSURE", sublabel: "Bioavailability Pathways", x: 78, y: 32 },
  { id: "response", label: "BIOLOGICAL RESPONSE", sublabel: "Cellular & Toxicogenomics", x: 52, y: 78 },
  { id: "health", label: "HEALTH", sublabel: "Ecosystem & Human Outcomes", x: 84, y: 80 },
];

export function ScientificHeroNetwork() {
  const [activeNode, setActiveNode] = React.useState<string | null>(null);

  return (
    <>
      {/* Desktop Overlay Network (hidden on mobile/tablet) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
        {/* SVG Curved Connecting Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14532D" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0F766E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2F7D4A" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Curved connecting conduits */}
          <path
            d="M 140 100 Q 300 40 420 80 T 780 150 Q 560 300 520 380 T 840 390"
            fill="none"
            stroke="url(#networkGradient)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse opacity-75"
          />
        </svg>

        {/* Nodes */}
        {NETWORK_NODES.map((node) => {
          const isActive = activeNode === node.id || activeNode === null;
          const isHighlighted = activeNode === node.id;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 cursor-pointer ${
                isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
              }`}
            >
              <div
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isHighlighted
                    ? "bg-[#14532D] text-white shadow-lg border border-[#2F7D4A] scale-105"
                    : "bg-white/90 text-[#17201B] border border-[#14532D]/20 shadow-md hover:border-[#14532D]"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    isHighlighted ? "bg-[#84CC16] animate-ping" : "bg-[#0F766E]"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="font-mono-scientific text-[11px] font-bold tracking-wider leading-none">
                    {node.label}
                  </span>
                  {isHighlighted && (
                    <span className="text-[9px] text-[#84CC16] font-mono-scientific uppercase tracking-widest leading-tight mt-0.5">
                      {node.sublabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Compact Scientific Pathway Banner */}
      <div className="block lg:hidden mt-6 pt-4 border-t border-current/10">
        <div className="text-[11px] font-mono-scientific uppercase tracking-widest text-[#0F766E] font-bold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Investigation Pathway</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-scientific">
          {NETWORK_NODES.map((node, index) => (
            <React.Fragment key={node.id}>
              <span className="px-2.5 py-1 rounded-md bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 font-semibold text-[11px]">
                {node.label}
              </span>
              {index < NETWORK_NODES.length - 1 && (
                <span className="text-[#0F766E] font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
