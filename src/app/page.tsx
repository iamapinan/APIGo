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
import { History, GripVertical, GripHorizontal } from "lucide-react";
import { Panel, Group, Separator } from "react-resizable-panels";

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
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/components/landing/LandingPage";
import { LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { api } from "@/utils/api";

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
  const { user, loading: authLoading, signOut } = useAuth();

  // Load data from API on mount
  useEffect(() => {
    if (!user) return;

    // Load History from API
    api.history
      .getAll()
      .then((data: HistoryItem[]) => {
        setHistory(data);
      })
      .catch((e: Error) => {
        console.error("Failed to fetch history from database:", e);
      });

    // Load Collections from API
    api.collections
      .getAll()
      .then((data) => {
        setCollections(data);
      })
      .catch((e: Error) => {
        console.error("Failed to fetch collections from database:", e);
      });

    // Load Environments from API
    api.environments
      .getAll()
      .then((data) => {
        setEnvironments(
          data.map((e: Environment) => ({
            ...e,
            variables:
              typeof e.variables === "string"
                ? JSON.parse(e.variables as string)
                : e.variables,
            headers:
              e.headers && typeof e.headers === "string"
                ? JSON.parse(e.headers as string)
                : e.headers,
          })),
        );
      })
      .catch((e: Error) => {
        console.error("Failed to fetch environments from database:", e);
      });
  }, [user]);

  // Save environments to API
  const handleSaveEnvironments = (newEnvs: Environment[]) => {
    const prevEnvs = environments;
    setEnvironments(newEnvs);

    // Diff: find added / updated / deleted
    newEnvs.forEach((env) => {
      const existing = prevEnvs.find((e) => e.id === env.id);
      if (!existing) {
        // New environment
        api.environments
          .create({
            id: env.id,
            name: env.name,
            variables: env.variables,
            headers: env.headers,
          })
          .catch((e: Error) =>
            console.error("Failed to create environment:", e),
          );
      } else {
        // Updated environment
        api.environments
          .update(env.id, {
            name: env.name,
            variables: env.variables,
            headers: env.headers,
          })
          .catch((e: Error) =>
            console.error("Failed to update environment:", e),
          );
      }
    });

    // Deleted environments
    prevEnvs.forEach((env) => {
      if (!newEnvs.find((e) => e.id === env.id)) {
        api.environments
          .delete(env.id)
          .catch((e: Error) =>
            console.error("Failed to delete environment:", e),
          );
      }
    });
  };

  const handleSetActiveEnvironment = (id: string | null) => {
    setActiveEnvironmentId(id);
  };

  // Delete individual history item
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    api.history
      .delete(id)
      .catch((e: Error) => console.error("Failed to delete history item:", e));
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    api.history
      .clearAll()
      .catch((e: Error) => console.error("Failed to clear history:", e));
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

    // Sync to DB
    api.history
      .create(newHistoryItem)
      .catch((e: Error) => console.error("Failed to save history", e));

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
      .filter((h: { isEnabled: boolean }) => h.isEnabled)
      .map((h: { key: string; value: string }) => ({
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

    // Background sync to DB
    api.collections
      .update(activeItemId, {
        method,
        url,
        headers,
        body,
      })
      .catch((e) => console.error("Failed to update collection item in DB", e));
  };

  const handleImportCollections = (newCollections: CollectionItem[]) => {
    setCollections(newCollections);
    // Sync to DB
    api.collections
      .importAll(newCollections)
      .catch((e) => console.error("Failed to sync imported collections", e));
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

      // Sync to DB
      api.collections.create(newItem).catch((e) => console.error(e));

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

    // Sync to DB
    api.collections
      .create({ ...newItem, parentId })
      .catch((e) => console.error(e));

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
    // Sync to DB
    api.collections
      .update(id, { name: newName })
      .catch((e) => console.error(e));
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

    // Sync DB Delete
    api.collections.delete(id).catch((e) => console.error(e));

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
    const safeHeaders =
      typeof item.headers === "string"
        ? JSON.parse(item.headers)
        : item.headers;
    setHeaders(safeHeaders || []);
    setBody(item.body || "");
  };

  const loadCollectionItem = (item: CollectionItem) => {
    setActiveItemId(item.id);
    setMethod(item.method || "GET");
    setUrl(item.url || "");
    const safeHeaders =
      typeof item.headers === "string"
        ? JSON.parse(item.headers)
        : item.headers;
    setHeaders(safeHeaders || []);
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
        // Sync to DB
        api.collections
          .importAll(importedItems)
          .catch((e) => console.error("Failed to sync Postman import", e));
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

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-zinc-500 text-sm font-medium animate-pulse">
            Initializing Neural Link...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <Group orientation="horizontal">
        {/* Sidebar */}
        {isSidebarOpen && (
          <>
            <Panel
              defaultSize={30}
              minSize={10}
              maxSize={50}
              className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
            >
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
                onDeleteHistory={handleDeleteHistory}
                onClearHistory={handleClearHistory}
                onCreateCollectionItem={handleCreateCollectionItem}
                onEditCollectionItem={handleEditCollectionItem}
                onDeleteCollectionItem={handleDeleteCollectionItem}
              />
            </Panel>
            <Separator className="w-1 group bg-transparent hover:bg-indigo-500/10 transition-colors relative z-10 flex items-center justify-center cursor-col-resize">
              <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-indigo-500 transition-colors" />
            </Separator>
          </>
        )}

        {/* Main Content */}
        <Panel defaultSize={70}>
          <div className="flex-1 h-full flex flex-col min-w-0">
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

                <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />

                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={28}
                      height={28}
                      unoptimized
                      className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <UserIcon className="h-4 w-4 text-indigo-400" />
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
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
              <Group orientation="horizontal">
                {/* Sidebar (Optional) - Handled separately if isSidebarOpen but PanelGroup needs children */}
                {/* Note: In this layout, Sidebar is outside Main Content div. 
                Wait, looking at line 523, the main is flex h-screen w-full.
                Sidebar line 525-549.
                Main Content div line 552-658.
                I should move Sidebar inside a PanelGroup for a better experience if possible,
                but I'll stick to the current layout structure if it's easier to maintain isSidebarOpen.
                Actually, putting everything in one PanelGroup is cleaner.
            */}

                {/* Request & Response Sections */}
                <Panel defaultSize={50} minSize={30}>
                  <div className="h-full flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 min-h-[300px]">
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
                </Panel>

                <Separator className="w-2 group bg-transparent hover:bg-indigo-500/10 transition-colors relative z-10 flex items-center justify-center cursor-col-resize">
                  <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-indigo-500 transition-colors" />
                </Separator>

                <Panel defaultSize={50} minSize={30}>
                  {/* Response Section */}
                  <div className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900/30 min-h-[300px]">
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
                </Panel>
              </Group>
            </div>
          </div>
        </Panel>
      </Group>

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
