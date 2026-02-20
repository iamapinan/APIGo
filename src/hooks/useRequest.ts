import { useState } from "react";
import { parseBodyContent } from "@/utils/request-types";

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
    bodyString: string,
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

      const structuredBody = parseBodyContent(bodyString);

      // Determine the payload to send to the proxy
      // We will send the structured representation, and let the proxy handle the actual construction
      const proxyPayload = {
        url: processedUrl,
        method,
        headers: requestHeaders,
        bodyType: structuredBody.type,
        bodyData:
          structuredBody.type === "raw"
            ? structuredBody.raw
            : structuredBody.type === "urlencoded"
              ? structuredBody.urlencoded.filter((i) => i.isEnabled && i.key)
              : structuredBody.type === "formdata"
                ? structuredBody.formdata.filter((i) => i.isEnabled && i.key)
                : undefined,
      };

      if (["GET", "HEAD"].includes(method)) {
        proxyPayload.bodyType = "none";
        proxyPayload.bodyData = undefined;
      }

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proxyPayload),
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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, sendRequest };
}
