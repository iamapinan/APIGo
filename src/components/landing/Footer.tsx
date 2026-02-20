"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 border-t border-zinc-800/60 bg-black/40 backdrop-blur-md mt-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-xl font-bold tracking-tight text-zinc-200">
            API <span className="text-indigo-500">Go!</span>
          </div>
          <p className="text-zinc-500 text-xs">
            Empowering interstellar development.
          </p>
        </div>

        <div className="text-zinc-500 text-xs font-mono tracking-wider">
          &copy; {new Date().getFullYear()} Gracer Corp Co.,Ltd. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
