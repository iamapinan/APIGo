import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { environmentId, userEmail } = await req.json();

    if (!environmentId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!existing || existing.userId !== user.uid) {
      return NextResponse.json(
        { error: "Forbidden or Not Found" },
        { status: 403 },
      );
    }

    const share = await prisma.environmentShare.create({
      data: { environmentId, userEmail },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("Error sharing environment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
