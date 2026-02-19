"use client";

import * as React from "react";

interface BodyEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BodyEditor({ content, onChange }: BodyEditorProps) {
  return (
    <div className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Body (JSON)
        </h3>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`{
  "key": "value"
}`}
        className="flex-1 w-full h-[200px] resize-none rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        spellCheck={false}
      />
    </div>
  );
}
