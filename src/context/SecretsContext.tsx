"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Secret {
  key: string;
  value: string;
  isEnabled: boolean;
}

interface SecretsContextType {
  secrets: Secret[];
  setSecrets: (secrets: Secret[]) => void;
  addSecret: () => void;
  updateSecret: (index: number, field: keyof Secret, value: any) => void;
  removeSecret: (index: number) => void;
  getSecretValue: (key: string) => string | null;
}

const SecretsContext = createContext<SecretsContextType | undefined>(undefined);

export function SecretsProvider({ children }: { children: ReactNode }) {
  const [secrets, setSecrets] = useState<Secret[]>([]);

  useEffect(() => {
    const savedSecrets = localStorage.getItem("global-secrets");
    if (savedSecrets) {
      try {
        setSecrets(JSON.parse(savedSecrets));
      } catch (e) {
        console.error("Failed to parse global secrets", e);
      }
    }
  }, []);

  const saveSecrets = (newSecrets: Secret[]) => {
    setSecrets(newSecrets);
    localStorage.setItem("global-secrets", JSON.stringify(newSecrets));
  };

  const addSecret = () => {
    saveSecrets([...secrets, { key: "", value: "", isEnabled: true }]);
  };

  const updateSecret = (index: number, field: keyof Secret, value: any) => {
    const newSecrets = [...secrets];
    newSecrets[index] = { ...newSecrets[index], [field]: value };
    saveSecrets(newSecrets);
  };

  const removeSecret = (index: number) => {
    const newSecrets = secrets.filter((_, i) => i !== index);
    saveSecrets(newSecrets);
  };

  const getSecretValue = (key: string) => {
    const secret = secrets.find((s) => s.key === key && s.isEnabled);
    return secret ? secret.value : null;
  };

  return (
    <SecretsContext.Provider
      value={{
        secrets,
        setSecrets: saveSecrets,
        addSecret,
        updateSecret,
        removeSecret,
        getSecretValue,
      }}
    >
      {children}
    </SecretsContext.Provider>
  );
}

export function useSecrets() {
  const context = useContext(SecretsContext);
  if (context === undefined) {
    throw new Error("useSecrets must be used within a SecretsProvider");
  }
  return context;
}
