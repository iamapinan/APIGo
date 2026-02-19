import * as React from "react";
import { cn } from "@/utils/cn";

interface ResponseMetaProps {
  status: number;
  statusText: string;
  time: number; // in ms
  size: number; // in bytes
}

export function ResponseMeta({
  status,
  statusText,
  time,
  size,
}: ResponseMetaProps) {
  const isSuccess = status >= 200 && status < 300;
  const isRedirect = status >= 300 && status < 400;
  const isError = status >= 400;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex items-center gap-4 text-xs font-medium">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Status:</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded",
            isSuccess && "bg-green-500/10 text-green-500",
            isRedirect && "bg-yellow-500/10 text-yellow-500",
            isError && "bg-red-500/10 text-red-500",
          )}
        >
          {status} {statusText}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Time:</span>
        <span className="text-zinc-200">{time} ms</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Size:</span>
        <span className="text-zinc-200">{formatSize(size)}</span>
      </div>
    </div>
  );
}
