"use client";

import * as React from "react";
import { Trash2, Plus } from "lucide-react";

interface Header {
  key: string;
  value: string;
  isEnabled: boolean;
}

interface HeadersEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
  globalHeaders?: Header[];
  environmentHeaders?: Header[];
}

export function HeadersEditor({
  headers,
  onChange,
  globalHeaders = [],
  environmentHeaders = [],
}: HeadersEditorProps) {
  const addHeader = () => {
    onChange([...headers, { key: "", value: "", isEnabled: true }]);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    newValue: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: newValue };
    onChange(newHeaders);
  };

  const toggleHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders[index] = {
      ...newHeaders[index],
      isEnabled: !newHeaders[index].isEnabled,
    };
    onChange(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    onChange(newHeaders);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Headers
        </h3>
        <button
          onClick={addHeader}
          className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
        >
          <Plus className="h-3 w-3" /> Add Header
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {environmentHeaders
          .filter((h) => h.isEnabled && h.key)
          .map((header, index) => (
            <div
              key={`env-${index}`}
              className="flex items-center gap-2 opacity-60"
            >
              <input
                type="checkbox"
                checked={header.isEnabled}
                readOnly
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-blue-600"
              />
              <input
                type="text"
                value={header.key}
                readOnly
                className="flex-1 rounded-md border border-transparent bg-transparent px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-400 focus:outline-none"
              />
              <input
                type="text"
                value={header.value}
                readOnly
                className="flex-1 rounded-md border border-transparent bg-transparent px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-400 focus:outline-none"
              />
              <div className="w-8 text-center text-[10px] uppercase font-bold text-green-600/60 dark:text-green-500/50">
                Env
              </div>
            </div>
          ))}

        {globalHeaders
          .filter((h) => h.isEnabled && h.key)
          .map((header, index) => (
            <div
              key={`global-${index}`}
              className="flex items-center gap-2 opacity-60"
            >
              <input
                type="checkbox"
                checked={header.isEnabled}
                readOnly
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-blue-600"
              />
              <input
                type="text"
                value={header.key}
                readOnly
                className="flex-1 rounded-md border border-transparent bg-transparent px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-400 focus:outline-none"
              />
              <input
                type="text"
                value={header.value}
                readOnly
                className="flex-1 rounded-md border border-transparent bg-transparent px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-400 focus:outline-none"
              />
              <div className="w-8 text-center text-[10px] uppercase font-bold text-blue-600/60 dark:text-blue-500/50">
                Glb
              </div>
            </div>
          ))}

        {headers.map((header, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={header.isEnabled}
              onChange={() => toggleHeader(index)}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
            />
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) => updateHeader(index, "key", e.target.value)}
              className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) => updateHeader(index, "value", e.target.value)}
              className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => removeHeader(index)}
              className="p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {headers.length === 0 && (
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            <div className="text-zinc-500 text-sm">
              No headers defined. Click Add Header or use Environment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
