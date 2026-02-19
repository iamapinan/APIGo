"use client";

import { Save } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  onSend: () => void;
  onSave: () => void;
  canSave: boolean;
}

export function UrlInput({
  value,
  onChange,
  onSend,
  onSave,
  canSave,
}: UrlInputProps) {
  return (
    <div className="flex flex-1 gap-2">
      <div className="flex flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          placeholder="Enter request URL"
          className="flex-1 rounded-r-none border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onSend}
          className="rounded-r-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          Send
        </button>
      </div>

      {canSave && (
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
          title="Save changes to collection"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      )}
    </div>
  );
}
