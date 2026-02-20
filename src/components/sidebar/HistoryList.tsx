"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Clock, X } from "lucide-react";

interface HistoryItem {
  id: string;
  method: string;
  url: string;
  date: string;
  headers?: { key: string; value: string; isEnabled: boolean }[];
  body?: string;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete?: (id: string) => void;
}

export function HistoryList({ history, onSelect, onDelete }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-zinc-500 text-xs gap-2">
        <Clock className="h-4 w-4 opacity-50" />
        <span>No history yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center group border-b border-zinc-200 dark:border-zinc-800/50"
        >
          <button
            onClick={() => onSelect(item)}
            className="flex-1 flex flex-col gap-1 text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-w-0"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-bold w-10 shrink-0",
                  item.method === "GET" && "text-blue-500",
                  item.method === "POST" && "text-green-500",
                  item.method === "PUT" && "text-orange-500",
                  item.method === "DELETE" && "text-red-500",
                  ["PATCH", "HEAD", "OPTIONS"].includes(item.method) &&
                    "text-yellow-500",
                )}
              >
                {item.method}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate font-mono opacity-80 group-hover:opacity-100">
                {item.url}
              </span>
            </div>
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="pr-2 pl-1 py-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all shrink-0"
              title="Delete history item"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
