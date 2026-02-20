import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";
import { ensureUser } from "@/utils/ensure-user";

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mocks = await (prisma as any).mockEndpoint.findMany({
      where: { userId: user.uid },
      include: {
        responses: {
          orderBy: { statusCode: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mocks);
  } catch (error) {
    console.error("Error fetching mocks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureUser(user.uid, user.email || "");

    const body = await req.json();
    const { path, method, description, responses, isPublic, rateLimit } = body;

    if (!path || !method) {
      return NextResponse.json(
        { error: "Path and method are required" },
        { status: 400 },
      );
    }

    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const newMock = await (prisma as any).mockEndpoint.create({
      data: {
        path: normalizedPath,
        method,
        description,
        userId: user.uid,
        isPublic: !!isPublic,
        rateLimit: rateLimit ? parseInt(rateLimit.toString()) : 100,
        responses: {
          create:
            responses?.map((r: any) => ({
              statusCode: parseInt(r.statusCode),
              body: r.body,
              headers: r.headers || undefined,
            })) || [],
        },
      },
      include: {
        responses: true,
      },
    });

    return NextResponse.json(newMock);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A mockup for this path and method already exists" },
        { status: 400 },
      );
    }
    console.error("Error creating mock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, path, method, description, responses, isPublic, rateLimit } =
      body;

    // Verify ownership
    const existing = await (prisma as any).mockEndpoint.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // Update with transactions or delete/create responses
    const updated = await prisma.$transaction(async (tx) => {
      // Delete all existing responses first
      await (tx as any).mockResponse.deleteMany({
        where: { mockEndpointId: id },
      });

      return (tx as any).mockEndpoint.update({
        where: { id },
        data: {
          path: normalizedPath,
          method,
          description,
          isPublic: !!isPublic,
          rateLimit: rateLimit ? parseInt(rateLimit.toString()) : 100,
          responses: {
            create:
              responses?.map((r: any) => ({
                statusCode: parseInt(r.statusCode),
                body: r.body,
                headers: r.headers || undefined,
              })) || [],
          },
        },
        include: {
          responses: true,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating mock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await (prisma as any).mockEndpoint.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await (prisma as any).mockEndpoint.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mock:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
