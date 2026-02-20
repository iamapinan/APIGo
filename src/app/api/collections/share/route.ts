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

    // Verify ownership
    const existing = await prisma.collectionItem.findUnique({
      where: { id: collectionId },
    });

    if (!existing || existing.userId !== user.uid) {
      return NextResponse.json(
        { error: "Forbidden or Not Found" },
        { status: 403 },
      );
    }

    // Create share record
    const share = await prisma.collectionShare.create({
      data: {
        collectionId,
        userEmail,
      },
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
