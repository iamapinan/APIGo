import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";
import { checkRateLimit } from "@/utils/rate-limiter";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleMockRequest(req, "/" + path.join("/"), "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleMockRequest(req, "/" + path.join("/"), "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleMockRequest(req, "/" + path.join("/"), "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleMockRequest(req, "/" + path.join("/"), "DELETE");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return handleMockRequest(req, "/" + path.join("/"), "PATCH");
}

async function handleMockRequest(
  req: NextRequest,
  path: string,
  method: string,
) {
  // 1. Initial lookup to check if public
  const mock = await (prisma as any).mockEndpoint.findFirst({
    where: {
      path: path,
      method: method,
    },
    include: {
      responses: true,
    },
  });

  if (!mock) {
    return NextResponse.json(
      { error: `Mock endpoint not found: ${method} ${path}` },
      { status: 404 },
    );
  }

  // 2. Authentication check
  if (!mock.isPublic) {
    const user = await getAuthUser(req);
    if (!user || user.uid !== mock.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    // 3. Rate limiting for public mocks
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = checkRateLimit(ip, mock.rateLimit || 100);

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": (mock.rateLimit || 100).toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limiter.reset.toString(),
          },
        },
      );
    }
  }

  try {
    // Determine status code to return
    const mockStatusHeader = req.headers.get("X-Mock-Status");
    const { searchParams } = new URL(req.url);
    const mockStatusQuery = searchParams.get("__status");

    let targetStatus = 200;
    if (mockStatusHeader) {
      targetStatus = parseInt(mockStatusHeader);
    } else if (mockStatusQuery) {
      targetStatus = parseInt(mockStatusQuery);
    }

    // Find the response for this status code
    const response = mock.responses.find(
      (r: any) => r.statusCode === targetStatus,
    );

    if (!response) {
      // If requested status not found, use the first available response
      const fallback = mock.responses[0];
      if (!fallback) {
        return NextResponse.json(
          { error: "No mock responses configured" },
          { status: 404 },
        );
      }

      return createResponse(fallback);
    }

    return createResponse(response);
  } catch (error) {
    console.error("Mock Resolver Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

function createResponse(response: any) {
  const headers = new Headers();
  if (response.headers) {
    (response.headers as any[]).forEach((h) => {
      if (h.isEnabled && h.key && h.value) {
        headers.append(h.key, h.value);
      }
    });
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new NextResponse(response.body || null, {
    status: response.statusCode,
    headers: headers,
  });
}
