"use client";

import { ArrowRight, Github, Zap } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  onLoginClick: () => void;
}

export default function Hero({ onLoginClick }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm mb-8 backdrop-blur animate-fade-in shadow-[0_0_15px_rgba(99,102,241,0.15)]">
        <Zap className="w-4 h-4 text-indigo-400" />
        <span>Open Source API Workspace</span>
        <a
          href="https://github.com/iamapinan/APIGo"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="text-xs">Star on GitHub</span>
        </a>
      </div>

      {/* Icon + Heading */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src="/apigo-icon.svg"
          alt="API Go! Icon"
          width={56}
          height={56}
          className="rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)]"
        />
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
        Test APIs with
        <br className="md:hidden" />
        <span className="text-indigo-400"> Blazing</span> Speed
      </h1>

      {/* Intro Text */}
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
        A premium, open-source API testing workspace. Organize requests into
        collections, manage environments, share with your team, and sync
        everything securely to the cloud.
      </p>

      {/* Call To Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={onLoginClick}
          className="group relative px-8 py-4 bg-white text-zinc-950 font-semibold rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          Get Started for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <a
          href="https://github.com/iamapinan/APIGo"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-8 py-4 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-300"
        >
          <Github className="w-5 h-5" />
          View on GitHub
        </a>
      </div>

      {/* App Screenshot */}
      <div className="mt-24 relative w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.15)] animate-float">
        {/* Browser Chrome */}
        <div className="absolute top-0 inset-x-0 h-10 bg-zinc-900/90 border-b border-zinc-800 flex items-center px-4 gap-2 z-10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
          </div>
          <div className="mx-auto flex items-center bg-zinc-950 border border-zinc-800 rounded px-12 py-1 text-zinc-600 text-xs font-mono">
            https://apigo.gracer.co.th
          </div>
          <div className="w-16" />
        </div>

        {/* Screenshot or placeholder */}
        <div className="pt-10 w-full">
          <Image
            src="/Screenshot.png"
            alt="API Go! Application Interface"
            width={1200}
            height={750}
            className="w-full object-cover object-top opacity-90"
            priority
            onError={(e) => {
              // hide broken image, show placeholder
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Ambient glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
