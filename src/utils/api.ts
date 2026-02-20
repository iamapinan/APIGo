import { auth } from "./firebase";
import { CollectionItem, HistoryItem } from "./postman-parser";
import { Environment } from "./variable-substitution";

// Smaller types used in API calls
export interface ApiSecret {
  key: string;
  value: string;
  isEnabled: boolean;
}

export interface ApiGlobalHeader {
  key: string;
  value: string;
  isEnabled: boolean;
}

export interface ShareResult {
  id: string;
  collectionId?: string;
  environmentId?: string;
  userEmail: string;
}

export interface BulkWriteResult {
  count: number;
}

/**
 * Helper to get the current user's Firebase ID token
 */
export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return user.getIdToken(true);
}

/**
 * Generic fetch wrapper to inject Auth token
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (
    !headers.has("Content-Type") &&
    options.method !== "DELETE" &&
    options.method !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  collections: {
    getAll: (): Promise<CollectionItem[]> => fetchWithAuth("/api/collections"),

    create: (
      item: CollectionItem & { parentId?: string | null },
    ): Promise<CollectionItem> =>
      fetchWithAuth("/api/collections", {
        method: "POST",
        body: JSON.stringify(item),
      }),

    update: (
      id: string,
      updates: Partial<CollectionItem>,
    ): Promise<CollectionItem> =>
      fetchWithAuth(`/api/collections/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),

    delete: (id: string): Promise<{ success: boolean }> =>
      fetchWithAuth(`/api/collections/${id}`, {
        method: "DELETE",
      }),

    share: (collectionId: string, userEmail: string): Promise<ShareResult> =>
      fetchWithAuth("/api/collections/share", {
        method: "POST",
        body: JSON.stringify({ collectionId, userEmail }),
      }),

    importAll: (items: CollectionItem[]): Promise<{ success: boolean }> =>
      fetchWithAuth("/api/collections", {
        method: "PUT",
        body: JSON.stringify(items),
      }),
  },

  history: {
    getAll: (): Promise<HistoryItem[]> => fetchWithAuth("/api/history"),

    create: (item: HistoryItem): Promise<HistoryItem> =>
      fetchWithAuth("/api/history", {
        method: "POST",
        body: JSON.stringify(item),
      }),

    delete: (id: string): Promise<{ success: boolean }> =>
      fetchWithAuth(`/api/history/${id}`, {
        method: "DELETE",
      }),

    clearAll: (): Promise<{ success: boolean }> =>
      fetchWithAuth("/api/history", {
        method: "DELETE",
      }),
  },

  environments: {
    getAll: (): Promise<Environment[]> => fetchWithAuth("/api/environments"),

    create: (env: Environment): Promise<Environment> =>
      fetchWithAuth("/api/environments", {
        method: "POST",
        body: JSON.stringify(env),
      }),

    update: (id: string, updates: Partial<Environment>): Promise<Environment> =>
      fetchWithAuth(`/api/environments/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),

    delete: (id: string): Promise<{ success: boolean }> =>
      fetchWithAuth(`/api/environments/${id}`, {
        method: "DELETE",
      }),

    share: (environmentId: string, userEmail: string): Promise<ShareResult> =>
      fetchWithAuth("/api/environments/share", {
        method: "POST",
        body: JSON.stringify({ environmentId, userEmail }),
      }),
  },

  secrets: {
    getAll: (): Promise<ApiSecret[]> => fetchWithAuth("/api/secrets"),

    saveAll: (secrets: ApiSecret[]): Promise<BulkWriteResult> =>
      fetchWithAuth("/api/secrets", {
        method: "PUT",
        body: JSON.stringify(secrets),
      }),
  },

  globalHeaders: {
    getAll: (): Promise<ApiGlobalHeader[]> =>
      fetchWithAuth("/api/global-headers"),

    saveAll: (headers: ApiGlobalHeader[]): Promise<BulkWriteResult> =>
      fetchWithAuth("/api/global-headers", {
        method: "PUT",
        body: JSON.stringify(headers),
      }),
  },
};
