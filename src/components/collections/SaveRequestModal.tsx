"use client";

import { useState } from "react";
import { X, Save, Folder, FileText } from "lucide-react";
import { CollectionItem } from "@/utils/postman-parser";

interface SaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: CollectionItem[];
  onSave: (name: string, collectionId: string, folderId?: string) => void;
  initialName?: string;
}

export function SaveRequestModal({
  isOpen,
  onClose,
  collections,
  onSave,
  initialName = "New Request",
}: SaveRequestModalProps) {
  const [name, setName] = useState(initialName);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  if (!isOpen) return null;

  // Flatten logic to find folders within a collection (1 level deep simplify for now or arbitrary)
  // For this V1, let's just support saving to Root of a Collection or Root Level (if we create a new collection).
  // Actually, let's allow selecting a Collection.

  const handleSave = () => {
    if (!name || !selectedCollectionId) return;
    onSave(name, selectedCollectionId, selectedFolderId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[400px] bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-100">Save Request</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              Request Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              placeholder="e.g. Get Users"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              Save to Collection
            </label>
            {collections.length === 0 ? (
              <div className="text-xs text-red-500">
                No collections found. Create or import one first.
              </div>
            ) : (
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a collection
                </option>
                {collections
                  .filter((c) => c.type === "folder" || c.children)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !selectedCollectionId}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3 w-3" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
