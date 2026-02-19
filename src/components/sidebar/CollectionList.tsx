"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Download,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CollectionItem } from "@/utils/postman-parser";

interface CollectionListProps {
  items: CollectionItem[];
  onSelect: (item: CollectionItem) => void;
  level?: number;
  onCreateItem?: (parentId: string, type: "folder" | "request") => void;
  onEditItem?: (id: string, newName: string) => void;
  onDeleteItem?: (id: string) => void;
}

export function CollectionList({
  items,
  onSelect,
  level = 0,
  onCreateItem,
  onEditItem,
  onDeleteItem,
}: CollectionListProps) {
  if (!items || items.length === 0) {
    if (level === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-zinc-500 text-xs gap-2">
          <Folder className="h-4 w-4 opacity-50" />
          <span>No collections yet</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <CollectionItemRenderer
          key={item.id}
          item={item}
          onSelect={onSelect}
          level={level}
          onCreateItem={onCreateItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
}

function CollectionItemRenderer({
  item,
  onSelect,
  level,
  onCreateItem,
  onEditItem,
  onDeleteItem,
}: {
  item: CollectionItem;
  onSelect: (item: CollectionItem) => void;
  level: number;
  onCreateItem?: (parentId: string, type: "folder" | "request") => void;
  onEditItem?: (id: string, newName: string) => void;
  onDeleteItem?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name || "");

  const paddingLeft = `${level * 12 + 12}px`;

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `${(item.name || "collection").replace(/\s+/g, "-").toLowerCase()}.json`,
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== item.name && onEditItem) {
      onEditItem(item.id, editName.trim());
    }
    setIsEditing(false);
  };

  if (item.type === "folder" || item.children) {
    return (
      <div className="flex flex-col select-none">
        <div
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-700 dark:text-zinc-300 transition-colors group relative"
          style={{ paddingLeft }}
          onClick={() => !isEditing && setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
          )}
          <Folder className="h-3.5 w-3.5 text-yellow-500/80 shrink-0" />

          {isEditing ? (
            <input
              autoFocus
              className="flex-1 bg-white dark:bg-zinc-950 border border-blue-500 text-xs px-1 py-0.5 rounded outline-none w-full text-zinc-900 dark:text-zinc-100"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setEditName(item.name || "");
                  setIsEditing(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs truncate font-medium flex-1">
              {item.name}
            </span>
          )}

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center">
            {onCreateItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                  onCreateItem(item.id, "request");
                }}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 rounded transition-colors"
                title="Add Request"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
            {onEditItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 rounded transition-colors"
                title="Edit Folder"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            )}
            {onDeleteItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="p-1 hover:bg-red-50 dark:hover:bg-zinc-700 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                title="Delete Folder"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            {/* Export Button for top-level folders/collections */}
            {level === 0 && (
              <button
                onClick={handleExport}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 rounded transition-colors"
                title="Export Collection"
              >
                <Download className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        {isOpen && item.children && (
          <CollectionList
            items={item.children}
            onSelect={onSelect}
            level={level + 1}
            onCreateItem={onCreateItem}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        )}
      </div>
    );
  }

  // Request Item
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors border-l-2 border-transparent hover:border-blue-500/50 group"
      style={{ paddingLeft }}
      onClick={() => !isEditing && onSelect(item)}
    >
      <span
        className={cn(
          "text-[9px] font-bold w-8 text-right shrink-0",
          item.method === "GET" && "text-blue-500",
          item.method === "POST" && "text-green-500",
          item.method === "PUT" && "text-orange-500",
          item.method === "DELETE" && "text-red-500",
          ["PATCH", "HEAD", "OPTIONS"].includes(item.method || "") &&
            "text-yellow-500",
        )}
      >
        {item.method || "GET"}
      </span>

      {isEditing ? (
        <input
          autoFocus
          className="flex-1 bg-white dark:bg-zinc-950 border border-blue-500 text-xs px-1 py-0.5 rounded outline-none w-full text-zinc-900 dark:text-zinc-100"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveEdit();
            if (e.key === "Escape") {
              setEditName(item.name || "");
              setIsEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="text-xs truncate flex-1">{item.name}</span>
      )}

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center">
        {onEditItem && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 rounded transition-colors"
            title="Edit Request"
          >
            <Edit2 className="h-3 w-3" />
          </button>
        )}
        {onDeleteItem && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(item.id);
            }}
            className="p-1 hover:bg-red-50 dark:hover:bg-zinc-700 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
            title="Delete Request"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
