"use client";

import * as React from "react";
import { Trash2, Plus } from "lucide-react";
import {
  parseBodyContent,
  stringifyBodyContent,
  BodyType,
  KeyVal,
} from "@/utils/request-types";
import { cn } from "@/utils/cn";

interface BodyEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BodyEditor({ content, onChange }: BodyEditorProps) {
  const body = parseBodyContent(content);

  const handleTypeChange = (type: BodyType) => {
    onChange(stringifyBodyContent({ ...body, type }));
  };

  const handleRawChange = (raw: string) => {
    onChange(stringifyBodyContent({ ...body, raw }));
  };

  const addField = (listType: "urlencoded" | "formdata") => {
    const newList = [
      ...body[listType],
      { key: "", value: "", isEnabled: true },
    ];
    onChange(stringifyBodyContent({ ...body, [listType]: newList }));
  };

  const updateField = (
    listType: "urlencoded" | "formdata",
    index: number,
    field: keyof KeyVal,
    value: string | boolean,
  ) => {
    const newList = [...body[listType]];
    newList[index] = { ...newList[index], [field]: value } as KeyVal;
    onChange(stringifyBodyContent({ ...body, [listType]: newList }));
  };

  const removeField = (listType: "urlencoded" | "formdata", index: number) => {
    const newList = body[listType].filter((_, i) => i !== index);
    onChange(stringifyBodyContent({ ...body, [listType]: newList }));
  };

  const renderList = (listType: "urlencoded" | "formdata") => {
    const list = body[listType];
    return (
      <div className="flex flex-col gap-2 mt-4">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.isEnabled}
              onChange={(e) =>
                updateField(listType, index, "isEnabled", e.target.checked)
              }
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
            />
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) =>
                updateField(listType, index, "key", e.target.value)
              }
              className="flex-[2] rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) =>
                updateField(listType, index, "value", e.target.value)
              }
              className="flex-[3] rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => removeField(listType, index)}
              className="p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-600 py-4">
            No fields. Click "Add Field" to create one.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-1">
          {(["none", "raw", "urlencoded", "formdata"] as BodyType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  body.type === type
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                )}
              >
                {type === "none" && "none"}
                {type === "raw" && "raw"}
                {type === "urlencoded" && "x-www-form-urlencoded"}
                {type === "formdata" && "form-data"}
              </button>
            ),
          )}
        </div>

        {(body.type === "urlencoded" || body.type === "formdata") && (
          <button
            onClick={() => addField(body.type as "urlencoded" | "formdata")}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
          >
            <Plus className="h-3 w-3" /> Add Field
          </button>
        )}
      </div>

      <div className="flex-1 mt-2">
        {body.type === "none" && (
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            <div className="text-zinc-500 text-sm">
              No fields defined. Switch to raw for custom JSON.
            </div>
          </div>
        )}

        {body.type === "raw" && (
          <textarea
            value={body.raw}
            onChange={(e) => handleRawChange(e.target.value)}
            placeholder={`{\n  "key": "value"\n}`}
            className="flex-1 w-full h-[300px] resize-none rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        )}

        {(body.type === "urlencoded" || body.type === "formdata") &&
          renderList(body.type)}
      </div>
    </div>
  );
}
