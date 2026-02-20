"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Type, List } from "lucide-react";
import {
  Environment,
  EnvironmentParameter,
} from "@/utils/variable-substitution";

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  environments: Environment[];
  onSave: (environments: Environment[]) => void;
}

export function EnvironmentModal({
  isOpen,
  onClose,
  environments: initialEnvironments,
  onSave,
}: EnvironmentModalProps) {
  const [environments, setEnvironments] =
    useState<Environment[]>(initialEnvironments);
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(
    initialEnvironments.length > 0 ? initialEnvironments[0].id : null,
  );
  // 'variables' or 'headers'
  const [activeTab, setActiveTab] = useState<"variables" | "headers">(
    "variables",
  );

  useEffect(() => {
    setTimeout(() => {
      setEnvironments(initialEnvironments);
      if (initialEnvironments.length > 0 && !selectedEnvId) {
        setSelectedEnvId(initialEnvironments[0].id);
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEnvironments, isOpen]);

  if (!isOpen) return null;

  const selectedEnv = environments.find((e) => e.id === selectedEnvId);

  const handleAddEnvironment = () => {
    const newEnv: Environment = {
      id: crypto.randomUUID(),
      name: "New Environment",
      variables: [],
      headers: [],
    };
    setEnvironments([...environments, newEnv]);
    setSelectedEnvId(newEnv.id);
  };

  const handleDeleteEnvironment = (id: string) => {
    const newEnvs = environments.filter((e) => e.id !== id);
    setEnvironments(newEnvs);
    if (selectedEnvId === id) {
      setSelectedEnvId(newEnvs.length > 0 ? newEnvs[0].id : null);
    }
  };

  const updateEnvName = (name: string) => {
    if (!selectedEnv) return;
    setEnvironments(
      environments.map((e) => (e.id === selectedEnvId ? { ...e, name } : e)),
    );
  };

  // Generic add function
  const addItem = (type: "variables" | "headers") => {
    if (!selectedEnv) return;
    const newItem: EnvironmentParameter = {
      key: "",
      value: "",
      isEnabled: true,
    };
    setEnvironments(
      environments.map((e) => {
        if (e.id !== selectedEnvId) return e;
        return {
          ...e,
          [type]: [...(e[type] || []), newItem],
        };
      }),
    );
  };

  // Generic update function
  const updateItem = (
    type: "variables" | "headers",
    index: number,
    field: keyof EnvironmentParameter,
    value: string | boolean,
  ) => {
    if (!selectedEnv) return;
    const list = selectedEnv[type] || [];
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };

    setEnvironments(
      environments.map((e) =>
        e.id === selectedEnvId ? { ...e, [type]: newList } : e,
      ),
    );
  };

  // Generic remove function
  const removeItem = (type: "variables" | "headers", index: number) => {
    if (!selectedEnv) return;
    const list = selectedEnv[type] || [];
    const newList = list.filter((_, i) => i !== index);
    setEnvironments(
      environments.map((e) =>
        e.id === selectedEnvId ? { ...e, [type]: newList } : e,
      ),
    );
  };

  const handleSave = () => {
    onSave(environments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[800px] h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Manage Environments
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Env List */}
          <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {environments.map((env) => (
                <div
                  key={env.id}
                  onClick={() => setSelectedEnvId(env.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer group ${
                    selectedEnvId === env.id
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                      : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <span className="truncate text-sm font-medium">
                    {env.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEnvironment(env.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddEnvironment}
              className="m-2 p-2 flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-800 border-dashed"
            >
              <Plus className="h-4 w-4" /> New Environment
            </button>
          </div>

          {/* Main Content - Env Details */}
          <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
            {selectedEnv ? (
              <div className="flex flex-col h-full">
                {/* Env Name */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1">
                    Environment Name
                  </label>
                  <input
                    type="text"
                    value={selectedEnv.name}
                    onChange={(e) => updateEnvName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                    placeholder="My Environment"
                  />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <button
                    onClick={() => setActiveTab("variables")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border-r border-zinc-200 dark:border-zinc-800 ${
                      activeTab === "variables"
                        ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    <Type className="h-3 w-3" /> Variables
                  </button>
                  <button
                    onClick={() => setActiveTab("headers")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium ${
                      activeTab === "headers"
                        ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    <List className="h-3 w-3" /> Global Headers
                  </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 capitalize">
                      {activeTab}
                    </h3>
                    <button
                      onClick={() => addItem(activeTab)}
                      className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Plus className="h-3 w-3" /> Add{" "}
                      {activeTab === "variables" ? "Variable" : "Header"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(!selectedEnv[activeTab] ||
                      selectedEnv[activeTab]!.length === 0) && (
                      <div className="text-center py-8 text-zinc-500 dark:text-zinc-600 text-sm">
                        No {activeTab} defined.
                      </div>
                    )}
                    {(selectedEnv[activeTab] || []).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 group"
                      >
                        <input
                          type="checkbox"
                          checked={item.isEnabled}
                          onChange={(e) =>
                            updateItem(
                              activeTab,
                              index,
                              "isEnabled",
                              e.target.checked,
                            )
                          }
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
                        />
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) =>
                            updateItem(activeTab, index, "key", e.target.value)
                          }
                          placeholder={
                            activeTab === "variables"
                              ? "Variable"
                              : "Header Key"
                          }
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) =>
                            updateItem(
                              activeTab,
                              index,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="Value"
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-700 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeItem(activeTab, index)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-500 text-sm">
                Select an environment to edit
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 rounded flex items-center gap-2 transition-colors"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
