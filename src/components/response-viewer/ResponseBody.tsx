"use client";

import * as React from "react";

const colorizeJson = (json: string) => {
  if (!json) return "";
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-green-400";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-400"; // key
        } else {
          cls = "text-orange-300"; // string value
        }
      } else if (/true|false/.test(match)) {
        cls = "text-pink-400"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-purple-400"; // null
      } else {
        cls = "text-yellow-400"; // number
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
};

interface ResponseBodyProps {
  body: string | null;
  contentType: string | null;
}

export function ResponseBody({ body, contentType }: ResponseBodyProps) {
  if (!body) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        No response body
      </div>
    );
  }

  let content = body;
  let isJson =
    contentType?.includes("application/json") ||
    (typeof body === "string" &&
      (body.trim().startsWith("{") || body.trim().startsWith("[")));

  if (isJson) {
    try {
      // Try to parse and re-stringify with indentation
      const parsed = JSON.parse(body);
      const stringified = JSON.stringify(parsed, null, 2);

      return (
        <div className="h-full overflow-auto bg-white dark:bg-zinc-950 p-4 rounded-md border border-zinc-200 dark:border-zinc-700">
          <pre
            className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: colorizeJson(stringified) }}
          />
        </div>
      );
    } catch (e) {
      // If parsing fails, leave as is (maybe it's not valid JSON despite the content-type)
      console.warn("Failed to beautify JSON", e);
    }
  }

  return (
    <div className="h-full overflow-auto bg-white dark:bg-zinc-950 p-4 rounded-md border border-zinc-200 dark:border-zinc-700">
      <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-all">
        {content}
      </pre>
    </div>
  );
}
