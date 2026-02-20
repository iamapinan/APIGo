"use client";

import { useState } from "react";
import {
  History,
  Folder,
  Upload,
  Settings,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { HistoryList } from "./HistoryList";
import { CollectionList } from "./CollectionList";
import { CollectionItem, HistoryItem } from "@/utils/postman-parser";

interface SidebarProps {
  history: HistoryItem[];
  collections: CollectionItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onSelectCollection: (item: CollectionItem) => void;
  onImport: () => void;
  onOpenSettings: () => void;
  onDeleteHistory?: (id: string) => void;
  onClearHistory?: () => void;
  onCreateCollectionItem?: (
    parentId: string | null,
    type: "folder" | "request",
  ) => void;
  onEditCollectionItem?: (id: string, newName: string) => void;
  onDeleteCollectionItem?: (id: string) => void;
}

export function Sidebar({
  history,
  collections,
  onSelectHistory,
  onSelectCollection,
  onImport,
  onOpenSettings,
  onDeleteHistory,
  onClearHistory,
  onCreateCollectionItem,
  onEditCollectionItem,
  onDeleteCollectionItem,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"history" | "collections">(
    "history",
  );

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col h-full">
      {/* Header / Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
            activeTab === "history"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-zinc-100 dark:bg-zinc-800/50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <History className="h-3.5 w-3.5" /> History
        </button>
        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <button
          onClick={() => setActiveTab("collections")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
            activeTab === "collections"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-zinc-100 dark:bg-zinc-800/50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Folder className="h-3.5 w-3.5" /> Collections
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900/50">
        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-600 tracking-wider">
          {activeTab === "history" ? "Recent Requests" : "Your Collections"}
        </span>
        <div className="flex items-center gap-2">
          {activeTab === "history" && onClearHistory && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[10px] flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Clear All History"
            >
              <Trash2 className="h-3 w-3" /> Clear All
            </button>
          )}
          {activeTab === "collections" && onCreateCollectionItem && (
            <button
              onClick={() => onCreateCollectionItem(null, "folder")}
              className="text-[10px] flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="New Root Folder"
            >
              <FolderPlus className="h-3 w-3" /> New
            </button>
          )}
          <button
            onClick={onImport}
            className="text-[10px] flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Import Postman Collection"
          >
            <Upload className="h-3 w-3" /> Import
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "history" ? (
          <HistoryList
            history={history}
            onSelect={onSelectHistory}
            onDelete={onDeleteHistory}
          />
        ) : (
          <CollectionList
            items={collections}
            onSelect={onSelectCollection}
            onCreateItem={onCreateCollectionItem}
            onEditItem={onEditCollectionItem}
            onDeleteItem={onDeleteCollectionItem}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-600 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
        <span>v1.5.0</span>
        <button
          onClick={onOpenSettings}
          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
