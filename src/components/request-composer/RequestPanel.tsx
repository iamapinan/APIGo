"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { HeadersEditor } from "./HeadersEditor";
import { BodyEditor } from "./BodyEditor";

interface Header {
  key: string;
  value: string;
  isEnabled: boolean;
}

interface RequestPanelProps {
  headers: Header[];
  body: string;
  onHeadersChange: (headers: Header[]) => void;
  onBodyChange: (body: string) => void;
  globalHeaders?: Header[];
  environmentHeaders?: Header[];
}

export function RequestPanel({
  headers,
  body,
  onHeadersChange,
  onBodyChange,
  globalHeaders,
  environmentHeaders,
}: RequestPanelProps) {
  const [activeTab, setActiveTab] = React.useState<"headers" | "body">(
    "headers",
  );

  return (
    <div className="flex flex-col h-full border-t border-zinc-200 dark:border-zinc-700">
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
        <button
          onClick={() => setActiveTab("headers")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "headers"
              ? "border-blue-500 text-blue-600 dark:text-blue-500"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
          )}
        >
          Headers
          {headers.length > 0 ||
          globalHeaders?.length ||
          environmentHeaders?.length ? (
            <span className="ml-2 rounded-full bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              {headers.filter((h) => h.isEnabled && h.key).length +
                (globalHeaders?.filter((h) => h.isEnabled && h.key).length ||
                  0) +
                (environmentHeaders?.filter((h) => h.isEnabled && h.key)
                  .length || 0)}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => setActiveTab("body")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "body"
              ? "border-blue-500 text-blue-600 dark:text-blue-500"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
          )}
        >
          Body
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
        {activeTab === "headers" && (
          <HeadersEditor
            headers={headers}
            onChange={onHeadersChange}
            globalHeaders={globalHeaders}
            environmentHeaders={environmentHeaders}
          />
        )}
        {activeTab === "body" && (
          <BodyEditor content={body} onChange={onBodyChange} />
        )}
      </div>
    </div>
  );
}
