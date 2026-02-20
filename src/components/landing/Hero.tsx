"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onLoginClick: () => void;
}

export default function Hero({ onLoginClick }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm mb-8 backdrop-blur animate-fade-in shadow-[0_0_15px_rgba(99,102,241,0.15)]">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Next Generation API Workspace</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
        Test APIs with
        <br className="md:hidden" />
        <span className="text-indigo-400"> Interstellar</span> Speed
      </h1>

      {/* Intro Text */}
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
        A premium, open-source API testing tool designed for high-performance
        teams. Streamline your workflow with ultra-fast local storage and
        optional cloud sync.
      </p>

      {/* Call To Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={onLoginClick}
          className="group relative px-8 py-4 bg-white text-zinc-950 font-semibold rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          Start for Free with Google
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* App Interface Mockup */}
      <div className="mt-24 relative w-full aspect-[16/10] max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-2xl animate-float">
        <div className="absolute top-0 inset-x-0 h-12 bg-zinc-900/80 border-b border-zinc-800 flex items-center px-4 gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <div className="mx-auto flex items-center bg-zinc-950 border border-zinc-800 rounded px-24 py-1.5 text-zinc-600 text-xs font-mono">
            https://api-go.space/request
          </div>
          <div className="w-12" /> {/* Spacer for balance */}
        </div>

        {/* Mockup Body Content */}
        <div className="absolute inset-x-0 top-12 bottom-0 flex opacity-60">
          {/* Sidebar Mock */}
          <div className="w-48 border-r border-zinc-800 flex flex-col p-4 gap-3">
            <div className="h-6 w-3/4 bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800/50 rounded-md animate-pulse delay-75" />
            <div className="h-4 w-2/3 bg-zinc-800/50 rounded-md animate-pulse delay-100" />
            <div className="h-4 w-4/5 bg-zinc-800/50 rounded-md animate-pulse delay-150" />
          </div>
          {/* Main Area Mock */}
          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b border-zinc-800 p-4 flex gap-3">
              <div className="w-24 h-full bg-indigo-500/20 rounded-md border border-indigo-500/30" />
              <div className="flex-1 h-full bg-zinc-800/40 rounded-md" />
            </div>
            <div className="flex-1 p-6 grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-4 flex flex-col gap-3">
                <div className="h-5 w-1/4 bg-zinc-800 rounded-md" />
                <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800" />
              </div>
              <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-4 flex flex-col gap-3">
                <div className="h-5 w-1/4 bg-zinc-800 rounded-md" />
                <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center">
                  <div className="text-zinc-600 font-mono text-sm">{`{ "status": 200 }`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Top Glow Over Mockup */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
