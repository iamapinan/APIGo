"use client";

import { useState, useEffect, useRef } from "react";
import { MethodSelector } from "@/components/request-composer/MethodSelector";
import { UrlInput } from "@/components/request-composer/UrlInput";
import { RequestPanel } from "@/components/request-composer/RequestPanel";
import { ResponsePanel } from "@/components/response-viewer/ResponsePanel";
import { ResponseMeta } from "@/components/response-viewer/ResponseMeta";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useRequest } from "@/hooks/useRequest";
import {
  parsePostmanCollection,
  CollectionItem,
  HistoryItem,
} from "@/utils/postman-parser";
import { History } from "lucide-react";

// Environment Imports
import {
  Environment,
  substituteVariables,
  substituteHeaders,
} from "@/utils/variable-substitution";
import {
  parseBodyContent,
  stringifyBodyContent,
  substituteStructuredBody,
} from "@/utils/request-types";
import { EnvironmentModal } from "@/components/environments/EnvironmentModal";
import { EnvironmentSelector } from "@/components/environments/EnvironmentSelector";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { useGlobalHeaders } from "@/context/GlobalHeadersContext";
import { useSecrets } from "@/context/SecretsContext";

// Shared Header interface (compatible with postman-parser types)
interface Header {
  key: string;
  value: string;
  isEnabled: boolean;
}

export default function Home() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json", isEnabled: true },
  ]);
  const [body, setBody] = useState("");

  // State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Environment State
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironmentId, setActiveEnvironmentId] = useState<string | null>(
    null,
  );
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const { isLoading, response, error, sendRequest } = useRequest();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("request-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedCollections = localStorage.getItem("request-collections");
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (e) {
        console.error("Failed to parse collections", e);
      }
    }

    const savedEnvs = localStorage.getItem("environments");
    if (savedEnvs) {
      try {
        setEnvironments(JSON.parse(savedEnvs));
      } catch (e) {
        console.error("Failed to parse environments", e);
      }
    }

    const savedActiveEnvId = localStorage.getItem("active-environment-id");
    if (savedActiveEnvId) {
      setActiveEnvironmentId(savedActiveEnvId);
    }
  }, []);

  // Save environments when changed
  const handleSaveEnvironments = (newEnvs: Environment[]) => {
    setEnvironments(newEnvs);
    localStorage.setItem("environments", JSON.stringify(newEnvs));
  };

  const handleSetActiveEnvironment = (id: string | null) => {
    setActiveEnvironmentId(id);
    if (id) {
      localStorage.setItem("active-environment-id", id);
    } else {
      localStorage.removeItem("active-environment-id");
    }
  };

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { globalHeaders } = useGlobalHeaders();
  const { secrets } = useSecrets();

  const handleSend = async () => {
    if (!url) return;

    // Add to history (store raw values)
    const newHistoryItem: HistoryItem = {
      id: crypto.randomUUID(),
      method,
      url,
      date: new Date().toISOString(),
      headers,
      body,
    };

    const newHistory = [newHistoryItem, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem("request-history", JSON.stringify(newHistory));

    // Variable Substitution
    let finalUrl = url;
    let finalHeaders = headers;
    let finalStructuredBody = parseBodyContent(body);

    // 1. Substitute with Environment Variables
    const activeEnv = environments.find((e) => e.id === activeEnvironmentId);
    let substitutedEnvHeaders: Header[] = [];

    if (activeEnv) {
      if (activeEnv.variables.length > 0) {
        finalUrl = substituteVariables(finalUrl, activeEnv.variables);
        finalHeaders = substituteHeaders(finalHeaders, activeEnv.variables);
        finalStructuredBody = substituteStructuredBody(
          finalStructuredBody,
          (val) => substituteVariables(val, activeEnv.variables),
        );
      }

      // Prepare Environment Headers
      if (activeEnv.headers && activeEnv.headers.length > 0) {
        const envHeaders = activeEnv.headers
          .filter((h) => h.isEnabled)
          .map((h) => ({
            key: h.key,
            value: h.value,
            isEnabled: true,
          }));

        substitutedEnvHeaders = substituteHeaders(
          envHeaders,
          activeEnv.variables,
        );
      }
    }

    // 2. Substitute with Global Secrets
    if (secrets.length > 0) {
      finalUrl = substituteVariables(finalUrl, secrets);
      finalHeaders = substituteHeaders(finalHeaders, secrets);
      finalStructuredBody = substituteStructuredBody(
        finalStructuredBody,
        (val) => substituteVariables(val, secrets),
      );
    }

    // 3. Inject Global Headers
    // Convert current headers to array if not already (it is)
    // Create a map of existing headers to avoid duplicates (request headers take precedence over global? Usually global are additive)
    // Strategy: Append global headers that are enabled. fetch will handle duplicates if allowed, or we can merge.
    // Let's merge: simple append.
    const activeGlobalHeaders = globalHeaders
      .filter((h) => h.isEnabled)
      .map((h) => ({
        key: h.key,
        value: h.value,
        isEnabled: true,
      }));

    // We need to substitute variables in Global Headers too!
    let substitutedGlobalHeaders = activeGlobalHeaders;
    if (activeEnv && activeEnv.variables.length > 0) {
      substitutedGlobalHeaders = substituteHeaders(
        substitutedGlobalHeaders,
        activeEnv.variables,
      );
    }
    if (secrets.length > 0) {
      substitutedGlobalHeaders = substituteHeaders(
        substitutedGlobalHeaders,
        secrets,
      );
    }

    const mergedHeaders = [
      ...finalHeaders,
      ...substitutedEnvHeaders,
      ...substitutedGlobalHeaders,
    ];

    await sendRequest(
      finalUrl,
      method,
      mergedHeaders,
      stringifyBodyContent(finalStructuredBody),
    );
  };

  const handleSave = () => {
    if (!activeItemId) return;

    const updateItemInList = (
      items: CollectionItem[],
      id: string,
    ): CollectionItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            method,
            url,
            headers,
            body,
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateItemInList(item.children, id),
          };
        }
        return item;
      });
    };

    const newCollections = updateItemInList(collections, activeItemId);
    setCollections(newCollections);
    localStorage.setItem("request-collections", JSON.stringify(newCollections));
  };

  const handleImportCollections = (newCollections: CollectionItem[]) => {
    setCollections(newCollections);
    localStorage.setItem("request-collections", JSON.stringify(newCollections));
  };

  const handleCreateCollectionItem = (
    parentId: string | null,
    type: "folder" | "request",
  ) => {
    const newItem: CollectionItem = {
      id: crypto.randomUUID(),
      name: type === "folder" ? "New Folder" : "New Request",
      type,
    };

    if (type === "request") {
      newItem.method = "GET";
      newItem.url = "";
      newItem.headers = [];
      newItem.body = "";
    } else {
      newItem.children = [];
    }

    if (!parentId) {
      const newCollections = [...collections, newItem];
      setCollections(newCollections);
      localStorage.setItem(
        "request-collections",
        JSON.stringify(newCollections),
      );
      if (type === "request") setActiveItemId(newItem.id);
      return;
    }

    const addItemToList = (items: CollectionItem[]): CollectionItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return { ...item, children: addItemToList(item.children) };
        }
        return item;
      });
    };

    const newCollections = addItemToList(collections);
    setCollections(newCollections);
    localStorage.setItem("request-collections", JSON.stringify(newCollections));
    if (type === "request") setActiveItemId(newItem.id);
  };

  const handleEditCollectionItem = (id: string, newName: string) => {
    const editItemInList = (items: CollectionItem[]): CollectionItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName };
        }
        if (item.children) {
          return { ...item, children: editItemInList(item.children) };
        }
        return item;
      });
    };
    const newCollections = editItemInList(collections);
    setCollections(newCollections);
    localStorage.setItem("request-collections", JSON.stringify(newCollections));
  };

  const handleDeleteCollectionItem = (id: string) => {
    const deleteItemFromList = (items: CollectionItem[]): CollectionItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children) {
            return { ...item, children: deleteItemFromList(item.children) };
          }
          return item;
        });
    };
    const newCollections = deleteItemFromList(collections);
    setCollections(newCollections);
    localStorage.setItem("request-collections", JSON.stringify(newCollections));

    if (activeItemId === id) {
      setActiveItemId(null);
      setMethod("GET");
      setUrl("");
      setHeaders([
        { key: "Content-Type", value: "application/json", isEnabled: true },
      ]);
      setBody("");
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setActiveItemId(null);
    setMethod(item.method);
    setUrl(item.url);
    setHeaders(item.headers || []);
    setBody(item.body || "");
  };

  const loadCollectionItem = (item: CollectionItem) => {
    setActiveItemId(item.id);
    setMethod(item.method || "GET");
    setUrl(item.url || "");
    setHeaders(item.headers || []);
    setBody(item.body || "");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const importedItems = parsePostmanCollection(json); // Returns CollectionItem[] now

        // Append to collections
        const newCollections = [...collections, ...importedItems];
        setCollections(newCollections);
        localStorage.setItem(
          "request-collections",
          JSON.stringify(newCollections),
        );
      } catch (err) {
        console.error("Failed to parse Postman file", err);
        alert("Invalid Postman Collection file");
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
          {/* Hidden Input for Import */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileUpload}
          />
          <Sidebar
            history={history}
            collections={collections}
            onSelectHistory={loadHistoryItem}
            onSelectCollection={loadCollectionItem}
            onImport={() => fileInputRef.current?.click()}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onCreateCollectionItem={handleCreateCollectionItem}
            onEditCollectionItem={handleEditCollectionItem}
            onDeleteCollectionItem={handleDeleteCollectionItem}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation / Header */}
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              <History className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              API Go!
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EnvironmentSelector
              environments={environments}
              activeEnvironmentId={activeEnvironmentId}
              onSelect={handleSetActiveEnvironment}
              onManage={() => setIsEnvModalOpen(true)}
            />
          </div>
        </header>

        {/* URL Bar */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex gap-0">
          <MethodSelector value={method} onChange={setMethod} />
          <UrlInput
            value={url}
            onChange={setUrl}
            onSend={handleSend}
            onSave={handleSave}
            canSave={!!activeItemId}
          />
        </div>

        {/* Content Area - Split Vertical */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Request Section */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 min-h-[300px]">
            <RequestPanel
              headers={headers}
              body={body}
              onHeadersChange={setHeaders}
              onBodyChange={setBody}
              globalHeaders={globalHeaders}
              environmentHeaders={
                environments.find((e) => e.id === activeEnvironmentId)
                  ?.headers || []
              }
            />
          </div>

          {/* Response Section */}
          <div className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-900/30 min-h-[300px]">
            {/* Response Meta Bar */}
            <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center px-4 justify-between">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Response
              </span>
              {response && (
                <ResponseMeta
                  status={response.status}
                  statusText={response.statusText}
                  time={response.time}
                  size={response.size}
                />
              )}
            </div>

            <div className="flex-1 overflow-hidden p-0 relative">
              <ResponsePanel
                response={response}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>

      <EnvironmentModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        environments={environments}
        onSave={handleSaveEnvironments}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        collections={collections}
        onImportCollections={handleImportCollections}
      />
    </main>
  );
}
