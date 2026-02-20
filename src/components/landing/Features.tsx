"use client";

import React from "react";
import { Zap, Shield, Globe, Cpu } from "lucide-react";

// Mockup Data สำหรับ Features
const mockFeatures = [
  {
    title: "Lightweight & Fast",
    description:
      "Built on Next.js 15 for near-instant startup and response times.",
    icon: Zap,
    color: "text-amber-400",
    bgIcon: "bg-amber-400/10 border-amber-400/20",
  },
  {
    title: "Secure by Design",
    description:
      "Local-first storage with optional encrypted cloud sync via Firebase.",
    icon: Shield,
    color: "text-emerald-400",
    bgIcon: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    title: "Global Environments",
    description:
      "Manage multiple environments with seamless variable substitution.",
    icon: Globe,
    color: "text-indigo-400",
    bgIcon: "bg-indigo-400/10 border-indigo-400/20",
  },
  {
    title: "Quantum Variables",
    description:
      "Advanced logic for dynamic request generation and data extraction.",
    icon: Cpu,
    color: "text-purple-400",
    bgIcon: "bg-purple-400/10 border-purple-400/20",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Engineered for Excellence
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-lg">
          Experience the most powerful API testing workspace ever created.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockFeatures.map((feature, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-300 group shadow-lg"
          >
            <div
              className={`p-3 rounded-xl border w-fit mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bgIcon}`}
            >
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-zinc-100">
              {feature.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
