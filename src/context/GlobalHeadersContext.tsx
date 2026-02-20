"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { api } from "@/utils/api";
import { useAuth } from "./AuthContext";

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
  const [globalHeaders, setGlobalHeadersState] = useState<GlobalHeader[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    api.globalHeaders
      .getAll()
      .then((data) => setGlobalHeadersState(data))
      .catch((e: Error) => console.error("Failed to load global headers:", e));
  }, [user]);

  const saveHeaders = useCallback((headers: GlobalHeader[]) => {
    setGlobalHeadersState(headers);
    api.globalHeaders
      .saveAll(headers)
      .catch((e: Error) => console.error("Failed to save global headers:", e));
  }, []);

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
