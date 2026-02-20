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

    const existing = await prisma.environment.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasAccess =
      existing.userId === user.uid ||
      existing.shares.some(
        (s: { userEmail: string }) => s.userEmail === user.email,
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.environment.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        variables:
          body.variables !== undefined
            ? JSON.stringify(body.variables)
            : undefined,
        headers:
          body.headers !== undefined ? JSON.stringify(body.headers) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating environment:", error);
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

    const existing = await prisma.environment.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.uid) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 },
      );
    }

    await prisma.environment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting environment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
