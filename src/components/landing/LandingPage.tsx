"use client";

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans relative">
      {/* Background Deep Glow FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(9,9,11,1)_80%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1">
          <Hero onLoginClick={signInWithGoogle} />
          <Features />
        </div>
        <Footer />
      </div>
    </div>
  );
}
