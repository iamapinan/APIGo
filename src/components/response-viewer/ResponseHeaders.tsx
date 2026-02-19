"use client";

import * as React from "react";

interface ResponseHeadersProps {
  headers: Record<string, string>;
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  if (Object.keys(headers).length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md">
        No headers
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md">
      <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
        <thead className="bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 uppercase">
          <tr>
            <th className="px-4 py-2 font-medium">Key</th>
            <th className="px-4 py-2 font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Object.entries(headers).map(([key, value]) => (
            <tr
              key={key}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                {key}
              </td>
              <td className="px-4 py-2 font-mono text-zinc-900 dark:text-zinc-200 break-all">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
