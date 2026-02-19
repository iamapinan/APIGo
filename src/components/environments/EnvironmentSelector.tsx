"use client";

import { ChevronDown, Eye } from "lucide-react";
import { Environment } from "@/utils/variable-substitution";
import { useState } from "react";

interface EnvironmentSelectorProps {
  environments: Environment[];
  activeEnvironmentId: string | null;
  onSelect: (id: string | null) => void;
  onManage: () => void;
}

export function EnvironmentSelector({
  environments,
  activeEnvironmentId,
  onSelect,
  onManage,
}: EnvironmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

  return (
    <div className="relative">
      <div className="flex items-center bg-white dark:bg-zinc-800 rounded-md border border-zinc-300 dark:border-zinc-700 p-0.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded text-sm text-zinc-700 dark:text-zinc-300 min-w-[140px] justify-between"
        >
          <span className="truncate max-w-[120px]">
            {activeEnv ? activeEnv.name : "No Environment"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <button
          onClick={onManage}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          title="Manage Environments"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xl z-20 py-1 max-h-60 overflow-y-auto">
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Select Environment
            </div>

            <button
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                activeEnvironmentId === null
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              No Environment
            </button>

            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => {
                  onSelect(env.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  activeEnvironmentId === env.id
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className="truncate">{env.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
