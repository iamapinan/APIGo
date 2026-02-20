"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { ResponseBody } from "./ResponseBody";
import { ResponseHeaders } from "./ResponseHeaders";
import { ResponsePreview } from "./ResponsePreview";

interface RequestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  requestHeaders: Record<string, string>;
  body: string | null;
  time: number;
  size: number;
  contentType: string | null;
}

interface ResponsePanelProps {
  response: RequestResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function ResponsePanel({
  response,
  isLoading,
  error,
}: ResponsePanelProps) {
  const [activeTab, setActiveTab] = React.useState<
    "body" | "preview" | "headers"
  >("body");

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-blue-500 dark:border-t-blue-500 border-r-transparent dark:border-r-transparent" />
          <span>Sending Request...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-md border border-red-200 dark:border-red-500/20 max-w-lg overflow-auto">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm opacity-80 whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-600">
        Enter a URL and click Send to get a response
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
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
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "preview"
              ? "border-blue-500 text-blue-600 dark:text-blue-500"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
          )}
        >
          Preview
        </button>
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
          <span className="ml-2 rounded-full bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            {Object.keys(response.headers).length}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-0 bg-zinc-50 dark:bg-zinc-950 relative">
        {activeTab === "body" && (
          <ResponseBody
            body={response.body}
            contentType={response.contentType}
          />
        )}
        {activeTab === "preview" && (
          <ResponsePreview
            body={response.body}
            contentType={response.contentType}
          />
        )}
        {activeTab === "headers" && (
          <div className="h-full overflow-auto p-4 flex flex-col gap-6 bg-white dark:bg-zinc-950">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Response Headers
              </h3>
              <ResponseHeaders headers={response.headers} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Request Headers
              </h3>
              <ResponseHeaders headers={response.requestHeaders} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
