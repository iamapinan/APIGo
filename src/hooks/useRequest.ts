import { useState } from "react";

interface Header {
  key: string;
  value: string;
  isEnabled: boolean;
}

interface RequestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  requestHeaders: Record<string, string>;
  body: string | null;
  time: number;
  size: number;
  contentType: string | null;
}

interface UseRequestReturn {
  isLoading: boolean;
  response: RequestResponse | null;
  error: string | null;
  sendRequest: (
    url: string,
    method: string,
    headers: Header[],
    body: string,
  ) => Promise<void>;
}

export function useRequest(): UseRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RequestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (
    url: string,
    method: string,
    headers: Header[],
    body: string,
  ) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();

    try {
      const requestHeaders: Record<string, string> = headers
        .filter((h) => h.isEnabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const processedUrl = url.startsWith("http") ? url : `https://${url}`;

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: processedUrl,
          method,
          headers: requestHeaders,
          body: ["GET", "HEAD"].includes(method) ? undefined : body,
        }),
      });

      const data = await res.json();

      const endTime = performance.now();
      const time = Math.round(endTime - startTime);

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setResponse({
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        requestHeaders,
        body: data.body,
        time,
        size: new Blob([data.body]).size,
        contentType: data.headers["content-type"] || null,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      // If the proxy fails, we might still get some response info, but usually it's a 500
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, sendRequest };
}
