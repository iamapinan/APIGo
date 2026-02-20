"use client";

import * as React from "react";

interface ResponsePreviewProps {
  body: string | null;
  contentType: string | null;
}

export function ResponsePreview({ body, contentType }: ResponsePreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (iframeRef.current && body && contentType?.includes("text/html")) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(body);
        doc.close();
      }
    }
  }, [body, contentType]);

  if (!body) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No content to preview
      </div>
    );
  }

  // Handle Images
  if (contentType?.startsWith("image/")) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 overflow-auto">
        <img
          src={`data:${contentType};base64,${body}`}
          alt="Response Preview"
          className="max-w-full h-auto shadow-lg rounded border border-zinc-200 dark:border-zinc-800"
          onError={(e) => {
            // If base64 fails, maybe it's a URL or direct string (though usually base64 for binary)
            // Fallback to direct src if it looks like one
            if (!body.startsWith("data:")) {
              (e.target as HTMLImageElement).src = body;
            }
          }}
        />
      </div>
    );
  }

  // Handle HTML
  if (contentType?.includes("text/html")) {
    return (
      <div className="h-full w-full bg-white flex flex-col">
        <iframe
          ref={iframeRef}
          title="Response Preview"
          className="flex-1 w-full border-none"
          sandbox="allow-scripts"
        />
      </div>
    );
  }

  // Handle PDF (Basic iFrame)
  if (contentType?.includes("application/pdf")) {
    return (
      <iframe
        src={`data:application/pdf;base64,${body}`}
        title="PDF Preview"
        className="h-full w-full border-none"
      />
    );
  }

  // Default fallback for other types (JSON, Text)
  return (
    <div className="h-full overflow-auto bg-white dark:bg-zinc-950 p-4">
      <div className="max-w-4xl mx-auto prose dark:prose-invert prose-sm">
        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs">
          <span>
            No specialized preview for{" "}
            <strong>{contentType || "text/plain"}</strong>. Showing raw content.
          </span>
        </div>
        <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-all bg-zinc-50 dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800">
          {body}
        </pre>
      </div>
    </div>
  );
}
