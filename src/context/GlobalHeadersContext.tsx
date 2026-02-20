"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface GlobalHeader {
  key: string;
  value: string;
  isEnabled: boolean;
}

interface GlobalHeadersContextType {
  globalHeaders: GlobalHeader[];
  setGlobalHeaders: (headers: GlobalHeader[]) => void;
  addGlobalHeader: () => void;
  updateGlobalHeader: (
    index: number,
    field: keyof GlobalHeader,
    value: string | boolean,
  ) => void;
  removeGlobalHeader: (index: number) => void;
}

const GlobalHeadersContext = createContext<
  GlobalHeadersContextType | undefined
>(undefined);

export function GlobalHeadersProvider({ children }: { children: ReactNode }) {
  const [globalHeaders, setGlobalHeaders] = useState<GlobalHeader[]>([]);

  useEffect(() => {
    const savedHeaders = localStorage.getItem("global-headers");
    if (savedHeaders) {
      try {
        const parsed = JSON.parse(savedHeaders);
        setTimeout(() => setGlobalHeaders(parsed), 0);
      } catch (e) {
        console.error("Failed to parse global headers", e);
      }
    }
  }, []);

  const saveHeaders = (headers: GlobalHeader[]) => {
    setGlobalHeaders(headers);
    localStorage.setItem("global-headers", JSON.stringify(headers));
  };

  const addGlobalHeader = () => {
    saveHeaders([...globalHeaders, { key: "", value: "", isEnabled: true }]);
  };

  const updateGlobalHeader = (
    index: number,
    field: keyof GlobalHeader,
    value: string | boolean,
  ) => {
    const newHeaders = [...globalHeaders];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    saveHeaders(newHeaders);
  };

  const removeGlobalHeader = (index: number) => {
    const newHeaders = globalHeaders.filter((_, i) => i !== index);
    saveHeaders(newHeaders);
  };

  return (
    <GlobalHeadersContext.Provider
      value={{
        globalHeaders,
        setGlobalHeaders: saveHeaders,
        addGlobalHeader,
        updateGlobalHeader,
        removeGlobalHeader,
      }}
    >
      {children}
    </GlobalHeadersContext.Provider>
  );
}

export function useGlobalHeaders() {
  const context = useContext(GlobalHeadersContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalHeaders must be used within a GlobalHeadersProvider",
    );
  }
  return context;
}
