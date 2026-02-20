import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, bodyType, bodyData } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let fetchBody: string | URLSearchParams | FormData | undefined = undefined;
    const fetchHeaders: Record<string, string> = { ...headers };

    if (!["GET", "HEAD"].includes(method) && bodyType !== "none") {
      if (bodyType === "raw") {
        fetchBody = bodyData;
      } else if (bodyType === "urlencoded") {
        const params = new URLSearchParams();
        (bodyData || []).forEach((item: { key: string; value: string }) => {
          params.append(item.key, item.value);
        });
        fetchBody = params;
        fetchHeaders["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (bodyType === "formdata") {
        const formData = new FormData();
        (bodyData || []).forEach((item: { key: string; value: string }) => {
          formData.append(item.key, item.value);
        });
        fetchBody = formData;
        // Remove Content-Type so fetch can auto-set it with the multipart boundary
        delete fetchHeaders["content-type"];
        delete fetchHeaders["Content-Type"];
      }
    }

    const response = await fetch(url, {
      method,
      headers: fetchHeaders,
      body: fetchBody,
    });

    const responseBody = await response.text();

    // Construct response headers object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
