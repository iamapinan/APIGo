"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { MockEndpoint, MockResponse } from "@/types/mockup";

interface MockupEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mock: Partial<MockEndpoint>) => void;
  initialData?: MockEndpoint | null;
}

export function MockupEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MockupEditorProps) {
  const [path, setPath] = useState("/");
  const [method, setMethod] = useState("GET");
  const [description, setDescription] = useState("");
  const [responses, setResponses] = useState<Partial<MockResponse>[]>([
    { statusCode: 200, body: "", headers: [] },
  ]);
  const [isPublic, setIsPublic] = useState(false);
  const [rateLimit, setRateLimit] = useState(100);
  const [activeResponseIndex, setActiveResponseIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setPath(initialData.path);
      setMethod(initialData.method);
      setDescription(initialData.description || "");
      setResponses(
        initialData.responses.length > 0
          ? initialData.responses.map((r) => ({ ...r }))
          : [{ statusCode: 200, body: "", headers: [] }],
      );
      setIsPublic(initialData.isPublic || false);
      setRateLimit(100);
      setActiveResponseIndex(0);
    } else {
      setPath("/");
      setMethod("GET");
      setDescription("");
      setResponses([{ statusCode: 200, body: "", headers: [] }]);
      setIsPublic(false);
      setRateLimit(100);
      setActiveResponseIndex(0);
    }
  }, [initialData, isOpen]);

  const handleAddResponse = () => {
    const nextStatus = 200 + responses.length;
    setResponses([
      ...responses,
      { statusCode: nextStatus, body: "", headers: [] },
    ]);
    setActiveResponseIndex(responses.length);
  };

  const handleRemoveResponse = (index: number) => {
    const newResponses = responses.filter((_, i) => i !== index);
    setResponses(newResponses);
    if (activeResponseIndex >= newResponses.length) {
      setActiveResponseIndex(Math.max(0, newResponses.length - 1));
    }
  };

  const handleUpdateResponse = (field: keyof MockResponse, value: any) => {
    const newResponses = [...responses];
    newResponses[activeResponseIndex] = {
      ...newResponses[activeResponseIndex],
      [field]: value,
    };
    setResponses(newResponses);
  };

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      path,
      method,
      description,
      isPublic,
      rateLimit,
      responses: responses as MockResponse[],
    });
  };

  if (!isOpen) return null;

  const currentResponse = responses[activeResponseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {initialData ? "Edit Mockup" : "Create New Mockup"}
            </h2>
            <p className="text-xs text-zinc-500">
              Configure your mock endpoint and its responses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Main Config */}
          <div className="p-6 space-y-4 border-r border-zinc-200 dark:border-zinc-800 lg:w-1/3 overflow-y-auto">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Method & Path
              </label>
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  {[
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "PATCH",
                    "HEAD",
                    "OPTIONS",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/api/v1/resource"
                  className="max-w-[140px] flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Public Access
                </span>
                <span className="text-[10px] text-zinc-500">
                  Enable access without auth
                </span>
              </div>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none",
                  isPublic ? "bg-blue-600" : "bg-zinc-400 dark:bg-zinc-600",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200",
                    isPublic ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>


            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this mock does..."
                className="w-full h-20 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all mr-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Responses
                </label>
                <button
                  onClick={handleAddResponse}
                  className="text-[10px] flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Add Status Code
                </button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {responses.map((resp, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveResponseIndex(idx)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all",
                      activeResponseIndex === idx
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold",
                        resp.statusCode &&
                          resp.statusCode >= 200 &&
                          resp.statusCode < 300
                          ? "text-green-600"
                          : "text-amber-600",
                      )}
                    >
                      {resp.statusCode}
                    </span>
                    {responses.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveResponse(idx);
                        }}
                        className="p-1 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response Config */}
          <div className="flex-1 p-6 flex flex-col min-h-0 bg-white dark:bg-zinc-900">
            {currentResponse ? (
              <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Status Code
                    </label>
                    <input
                      type="number"
                      value={currentResponse.statusCode}
                      onChange={(e) =>
                        handleUpdateResponse(
                          "statusCode",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-24 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col flex-wrap">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Response Body (JSON or Plain Text)
                  </label>
                  <textarea
                    value={currentResponse.body || ""}
                    onChange={(e) =>
                      handleUpdateResponse("body", e.target.value)
                    }
                    placeholder='{"key": "value"}'
                    className="flex-1 w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm font-mono p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Response Headers
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(currentResponse.headers as any[])?.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          placeholder="Header"
                          value={h.key}
                          onChange={(e) => {
                            const newHeaders = [
                              ...(currentResponse.headers as any[]),
                            ];
                            newHeaders[i].key = e.target.value;
                            handleUpdateResponse("headers", newHeaders);
                          }}
                          className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs px-2 py-1.5 outline-none"
                        />
                        <input
                          placeholder="Value"
                          value={h.value}
                          onChange={(e) => {
                            const newHeaders = [
                              ...(currentResponse.headers as any[]),
                            ];
                            newHeaders[i].value = e.target.value;
                            handleUpdateResponse("headers", newHeaders);
                          }}
                          className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs px-2 py-1.5 outline-none"
                        />
                        <button
                          onClick={() => {
                            const newHeaders = (
                              currentResponse.headers as any[]
                            ).filter((_, idx) => idx !== i);
                            handleUpdateResponse("headers", newHeaders);
                          }}
                          className="p-1.5 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newHeaders = [
                          ...((currentResponse.headers as any[]) || []),
                          { key: "", value: "", isEnabled: true },
                        ];
                        handleUpdateResponse("headers", newHeaders);
                      }}
                      className="text-[10px] flex items-center gap-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                    >
                      <Plus className="h-3 w-3" /> Add Header
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 italic text-sm">
                Add segments to configure responses.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Mockup
          </button>
        </div>
      </div>
    </div>
  );
}
