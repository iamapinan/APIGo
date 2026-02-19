"use client";

import { useEffect, useState } from "react";
import { X, Moon, Sun, Plus, Trash2, Download } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useGlobalHeaders } from "@/context/GlobalHeadersContext";
import { useSecrets } from "@/context/SecretsContext";
import { CollectionItem } from "@/utils/postman-parser";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: CollectionItem[];
  onImportCollections: (collections: CollectionItem[]) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  collections,
  onImportCollections,
}: SettingsModalProps) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const {
    globalHeaders,
    setGlobalHeaders,
    addGlobalHeader,
    updateGlobalHeader,
    removeGlobalHeader,
  } = useGlobalHeaders();
  const { secrets, setSecrets, addSecret, updateSecret, removeSecret } =
    useSecrets();

  const [activeTab, setActiveTab] = useState<
    "general" | "headers" | "secrets" | "export"
  >("general");

  if (!isOpen) return null;

  const handleExportConfigs = () => {
    const config = {
      theme,
      globalHeaders,
      secrets: secrets.map((s) => ({ ...s, value: "" })), // Don't export actual secret values for security
      collections,
      exportDate: new Date().toISOString(),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `api-go-config-${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportConfigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (json.theme) {
          setTheme(json.theme);
        }

        if (json.globalHeaders) {
          setGlobalHeaders(json.globalHeaders);
        }

        if (json.secrets) {
          setSecrets(json.secrets);
        }

        if (json.collections) {
          onImportCollections(json.collections);
        }

        alert("Configuration imported successfully!");
      } catch (err) {
        console.error("Failed to parse config file", err);
        alert("Invalid configuration file");
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[800px] h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col p-2 space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`text-left px-3 py-2 rounded text-sm font-medium ${
                activeTab === "general"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("headers")}
              className={`text-left px-3 py-2 rounded text-sm font-medium ${
                activeTab === "headers"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Global Headers
            </button>
            <button
              onClick={() => setActiveTab("secrets")}
              className={`text-left px-3 py-2 rounded text-sm font-medium ${
                activeTab === "secrets"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Global Secrets
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`text-left px-3 py-2 rounded text-sm font-medium ${
                activeTab === "export"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Export & Import
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                    Theme
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center gap-2 px-4 py-2 rounded border ${
                        theme === "dark"
                          ? "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Moon className="h-4 w-4" /> Dark
                    </button>
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center gap-2 px-4 py-2 rounded border ${
                        theme === "light"
                          ? "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Sun className="h-4 w-4" /> Light
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Global Headers Tab */}
            {activeTab === "headers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300">
                    Global Headers
                  </h3>
                  <button
                    onClick={addGlobalHeader}
                    className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    <Plus className="h-3 w-3" /> Add Header
                  </button>
                </div>
                <div className="space-y-2">
                  {globalHeaders.length === 0 && (
                    <div className="text-zinc-500 text-sm">
                      No global headers defined.
                    </div>
                  )}
                  {globalHeaders.map((header, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <input
                        type="checkbox"
                        checked={header.isEnabled}
                        onChange={(e) =>
                          updateGlobalHeader(
                            index,
                            "isEnabled",
                            e.target.checked,
                          )
                        }
                        className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) =>
                          updateGlobalHeader(index, "key", e.target.value)
                        }
                        placeholder="Key"
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) =>
                          updateGlobalHeader(index, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeGlobalHeader(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  These headers will be applied to every request automatically.
                </p>
              </div>
            )}

            {/* Global Secrets Tab */}
            {activeTab === "secrets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300">
                    Global Secrets
                  </h3>
                  <button
                    onClick={addSecret}
                    className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    <Plus className="h-3 w-3" /> Add Secret
                  </button>
                </div>
                <div className="space-y-2">
                  {secrets.length === 0 && (
                    <div className="text-zinc-500 text-sm">
                      No global secrets defined.
                    </div>
                  )}
                  {secrets.map((secret, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <input
                        type="checkbox"
                        checked={secret.isEnabled}
                        onChange={(e) =>
                          updateSecret(index, "isEnabled", e.target.checked)
                        }
                        className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
                      />
                      <input
                        type="text"
                        value={secret.key}
                        onChange={(e) =>
                          updateSecret(index, "key", e.target.value)
                        }
                        placeholder="Variable Name"
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={secret.value}
                        onChange={(e) =>
                          updateSecret(index, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeSecret(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Secrets can be used in URLs, Headers, and Body using{" "}
                  <code className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1 rounded">
                    {"{{variable_name}}"}
                  </code>
                  .
                </p>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === "export" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">
                    Export Configuration
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    Download a JSON file containing all settings, environments,
                    and collections (Secrets values are excluded for security).
                  </p>
                  <button
                    onClick={handleExportConfigs}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors"
                  >
                    <Download className="h-4 w-4" /> Export All Configs
                  </button>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">
                    Import Configuration
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    Select an exported JSON configuration file to restore your
                    settings.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 rounded text-sm font-medium cursor-pointer transition-colors border border-zinc-200 dark:border-zinc-700">
                    <Plus className="h-4 w-4" /> Select Config File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfigs}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
