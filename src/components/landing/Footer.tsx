"use client";

import { Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 border-t border-zinc-800/60 bg-black/40 backdrop-blur-md mt-auto z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/apigo-icon.svg"
            alt="API Go! Icon"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <div className="text-base font-bold tracking-tight text-zinc-200">
              API <span className="text-indigo-500">Go!</span>
            </div>
            <p className="text-zinc-600 text-xs">Open source API workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/iamapinan/APIGo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <div className="text-zinc-600 text-xs font-mono tracking-wider">
            &copy; {new Date().getFullYear()} Gracer Corp Co.,Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
}
