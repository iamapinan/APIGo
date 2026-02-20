"use client";

import { useState } from "react";
import { X, Share2, Plus, Trash2 } from "lucide-react";
import { api } from "@/utils/api";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "collection" | "environment";
  resourceId: string;
  resourceName: string;
  existingShares?: string[];
}

export function ShareModal({
  isOpen,
  onClose,
  type,
  resourceId,
  resourceName,
  existingShares = [],
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState<string[]>(existingShares);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      if (type === "collection") {
        await api.collections.share(resourceId, email.trim());
      } else {
        await api.environments.share(resourceId, email.trim());
      }
      setShares((prev) => [...prev, email.trim()]);
      setEmail("");
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to share. Please check the email and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Share {type === "collection" ? "Collection" : "Environment"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sharing{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {resourceName}
            </span>{" "}
            will allow that user to view and use this {type}.
          </p>

          {/* Add email */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShare()}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              onClick={handleShare}
              disabled={isLoading || !email.trim()}
              className="flex items-center gap-1 px-3 py-2 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-3 w-3" />
              Share
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}

          {/* Shared with list */}
          {shares.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                Shared with
              </p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {shares.map((sharedEmail) => (
                  <div
                    key={sharedEmail}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  >
                    <span className="text-xs text-zinc-700 dark:text-zinc-300">
                      {sharedEmail}
                    </span>
                    <Trash2 className="h-3 w-3 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
