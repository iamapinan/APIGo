import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collectionId, userEmail } = await req.json();

    if (!collectionId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Ensure the requesting user exists in DB
    await prisma.user.upsert({
      where: { id: user.uid },
      update: { email: user.email || "" },
      create: { id: user.uid, email: user.email || "" },
    });

    // Verify collection exists
    const existing = await prisma.collectionItem.findUnique({
      where: { id: collectionId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    // Verify ownership
    if (existing.userId !== user.uid) {
      return NextResponse.json(
        { error: "Forbidden: you do not own this collection" },
        { status: 403 },
      );
    }

    // Upsert share record (avoid duplicate error)
    const share = await prisma.collectionShare.upsert({
      where: {
        collectionId_userEmail: { collectionId, userEmail },
      },
      update: {},
      create: { collectionId, userEmail },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("Error sharing collection item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
