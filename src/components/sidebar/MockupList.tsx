"use client";

import { useState } from "react";
import { Server, Edit2, Trash2, Globe } from "lucide-react";
import { cn } from "@/utils/cn";
import { MockEndpoint } from "@/types/mockup";

interface MockupListProps {
  items: MockEndpoint[];
  onSelect: (item: MockEndpoint) => void;
  onEdit: (item: MockEndpoint) => void;
  onDelete: (id: string) => void;
}

export function MockupList({
  items,
  onSelect,
  onEdit,
  onDelete,
}: MockupListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-zinc-500 text-xs gap-2">
        <Server className="h-4 w-4 opacity-50" />
        <span>No mockups yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors border-l-2 border-transparent hover:border-blue-500/50 group"
          onClick={() => onSelect(item)}
        >
          <div className="flex flex-col flex-1 truncate">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[9px] font-bold w-10 text-right shrink-0",
                  item.method === "GET" && "text-blue-500",
                  item.method === "POST" && "text-green-500",
                  item.method === "PUT" && "text-orange-500",
                  item.method === "DELETE" && "text-red-500",
                  ["PATCH", "HEAD", "OPTIONS"].includes(item.method || "") &&
                    "text-yellow-500",
                )}
              >
                {item.method}
              </span>
              <span className="text-xs truncate font-medium text-zinc-800 dark:text-zinc-200">
                {item.path}
              </span>
              {item.isPublic && (
                <div
                  className="flex items-center gap-0.5"
                  title="Publicly accessible"
                >
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-bold uppercase text-green-600 dark:text-green-400">
                    Public
                  </span>
                </div>
              )}
            </div>
            {item.description && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate pl-12">
                {item.description}
              </span>
            )}
            {item.isPublic && (
              <span className="text-[8px] text-zinc-400 dark:text-zinc-500 truncate pl-12 italic">
                Limit: {item.rateLimit} req/min
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Copy mock URL to clipboard
                const url = `${window.location.origin}/api/mock${item.path}`;
                navigator.clipboard.writeText(url);
              }}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-blue-500 rounded transition-colors"
              title="Copy Mock URL"
            >
              <Globe className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 rounded transition-colors"
              title="Edit Mockup"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1 hover:bg-red-50 dark:hover:bg-zinc-700 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
              title="Delete Mockup"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
