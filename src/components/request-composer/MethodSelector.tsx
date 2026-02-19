"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <span
          className={cn(
            "w-12 text-left",
            value === "GET" && "text-blue-500",
            value === "POST" && "text-green-500",
            value === "PUT" && "text-orange-500",
            value === "DELETE" && "text-red-500",
            ["PATCH", "HEAD", "OPTIONS"].includes(value) && "text-yellow-500",
          )}
        >
          {value}
        </span>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg">
          {methods.map((method) => (
            <button
              key={method}
              onClick={() => {
                onChange(method);
                setIsOpen(false);
              }}
              className={cn(
                "block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800",
                method === value
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400",
                method === "GET" && "text-blue-500",
                method === "POST" && "text-green-500",
                method === "PUT" && "text-orange-500",
                method === "DELETE" && "text-red-500",
                ["PATCH", "HEAD", "OPTIONS"].includes(method) &&
                  "text-yellow-500",
              )}
            >
              {method}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
