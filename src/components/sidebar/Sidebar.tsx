"use client";

import { useState } from "react";
import {
  History,
  Folder,
  Upload,
  Settings,
  FolderPlus,
  Trash2,
  Server,
  PlusCircle,
} from "lucide-react";
import { HistoryList } from "./HistoryList";
import { CollectionList } from "./CollectionList";
import { MockupList } from "./MockupList";
import { CollectionItem, HistoryItem } from "@/utils/postman-parser";
import { MockEndpoint } from "@/types/mockup";

interface SidebarProps {
  history: HistoryItem[];
  collections: CollectionItem[];
  mockups: MockEndpoint[];
  activeTab: "history" | "collections" | "mockups";
  onTabChange: (tab: "history" | "collections" | "mockups") => void;
  onSelectHistory: (item: HistoryItem) => void;
  onSelectCollection: (item: CollectionItem) => void;
  onSelectMockup: (item: MockEndpoint) => void;
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
  onCreateMockup?: () => void;
  onEditMockup?: (item: MockEndpoint) => void;
  onDeleteMockup?: (id: string) => void;
}

export function Sidebar({
  history,
  collections,
  mockups,
  activeTab,
  onTabChange,
  onSelectHistory,
  onSelectCollection,
  onSelectMockup,
  onImport,
  onOpenSettings,
  onDeleteHistory,
  onClearHistory,
  onCreateCollectionItem,
  onEditCollectionItem,
  onDeleteCollectionItem,
  onCreateMockup,
  onEditMockup,
  onDeleteMockup,
}: SidebarProps) {
  return (
    <aside className="w-full bg-zinc-50 dark:bg-zinc-900 flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800">
      {/* Header / Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => onTabChange("history")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-medium transition-colors ${
            activeTab === "history"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-zinc-100 dark:bg-zinc-800/50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <History className="h-3.5 w-3.5" /> History
        </button>
        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <button
          onClick={() => onTabChange("collections")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-medium transition-colors ${
            activeTab === "collections"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-zinc-100 dark:bg-zinc-800/50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Folder className="h-3.5 w-3.5" /> Collections
        </button>
        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <button
          onClick={() => onTabChange("mockups")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-medium transition-colors ${
            activeTab === "mockups"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-zinc-100 dark:bg-zinc-800/50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Server className="h-3.5 w-3.5" /> Mocks
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900/50">
        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-600 tracking-wider">
          {activeTab === "history"
            ? "Recent Requests"
            : activeTab === "collections"
              ? "Your Collections"
              : "Mockup Endpoints"}
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
          {activeTab === "mockups" && onCreateMockup && (
            <button
              onClick={onCreateMockup}
              className="text-[10px] flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Create New Mockup"
            >
              <PlusCircle className="h-3 w-3" /> New Mock
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
        ) : activeTab === "collections" ? (
          <CollectionList
            items={collections}
            onSelect={onSelectCollection}
            onCreateItem={onCreateCollectionItem}
            onEditItem={onEditCollectionItem}
            onDeleteItem={onDeleteCollectionItem}
          />
        ) : (
          <MockupList
            items={mockups}
            onSelect={onSelectMockup}
            onEdit={onEditMockup!}
            onDelete={onDeleteMockup!}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-600 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
        <span>v2.0.0</span>
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
