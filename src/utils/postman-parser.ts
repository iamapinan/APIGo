import { v4 as uuidv4 } from "uuid";

interface PostmanHeader {
  key: string;
  value: string;
  type?: string;
  disabled?: boolean;
}

interface PostmanUrl {
  raw: string;
  protocol?: string;
  host?: string[];
  path?: string[];
  query?: { key: string; value: string }[];
  variable?: unknown[];
}

interface PostmanRequest {
  method: string;
  header: PostmanHeader[];
  body?: {
    mode: string;
    raw: string;
    options?: unknown;
  };
  url: string | PostmanUrl;
}

interface PostmanItem {
  id?: string;
  name: string;
  request?: PostmanRequest;
  item?: PostmanItem[]; // Folders
}

interface PostmanCollection {
  info: {
    _postman_id: string;
    name: string;
    schema: string;
  };
  item: PostmanItem[];
}

// Updated data structure for hierarchical support
export interface CollectionItem {
  id: string;
  name: string;
  type: "request" | "folder";
  method?: string;
  url?: string;
  headers?: { key: string; value: string; isEnabled: boolean }[];
  body?: string;
  children?: CollectionItem[];
}

// Keep HistoryItem for backward compatibility if needed, using same structure roughly
export interface HistoryItem {
  id: string;
  method: string;
  url: string;
  date: string;
  headers?: { key: string; value: string; isEnabled: boolean }[];
  body?: string;
}

export function parsePostmanCollection(
  json: PostmanCollection,
): CollectionItem[] {
  function traverse(node: PostmanItem[]): CollectionItem[] {
    if (!node || !Array.isArray(node)) return [];

    const result: CollectionItem[] = [];

    for (const item of node) {
      if (item.request) {
        // It's a request
        try {
          const method = item.request.method || "GET";

          let url = "";
          if (typeof item.request.url === "string") {
            url = item.request.url;
          } else if (item.request.url?.raw) {
            url = item.request.url.raw;
          }

          const headers =
            item.request.header?.map((h) => ({
              key: h.key,
              value: h.value,
              isEnabled: !h.disabled,
            })) || [];

          let body = "";
          if (item.request.body?.mode === "raw" && item.request.body.raw) {
            body = item.request.body.raw;
          }

          result.push({
            id: uuidv4(),
            name: item.name || "Untitled Request",
            type: "request",
            method,
            url,
            headers,
            body,
          });
        } catch (e) {
          console.warn("Failed to parse Postman item", item.name, e);
        }
      } else if (item.item) {
        // It's a folder
        result.push({
          id: uuidv4(),
          name: item.name || "Untitled Folder",
          type: "folder",
          children: traverse(item.item),
        });
      }
    }
    return result;
  }

  if (json.item) {
    return traverse(json.item);
  }

  return [];
}
