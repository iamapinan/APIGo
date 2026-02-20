import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Verify ownership or shared access
    const existing = await prisma.collectionItem.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasAccess =
      existing.userId === user.uid ||
      existing.shares.some(
        (share: { userEmail: string }) => share.userEmail === user.email,
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.collectionItem.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        method: body.method !== undefined ? body.method : undefined,
        url: body.url !== undefined ? body.url : undefined,
        body: body.body !== undefined ? body.body : undefined,
        headers:
          body.headers !== undefined ? JSON.stringify(body.headers) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating collection item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Verify ownership or shared access
    const existing = await prisma.collectionItem.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasAccess =
      existing.userId === user.uid ||
      existing.shares.some(
        (share: { userEmail: string }) => share.userEmail === user.email,
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.collectionItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
