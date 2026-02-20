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
    const headers = await prisma.globalHeader.findMany({
      where: { userId: user.uid },
    });
    return NextResponse.json(headers);
  } catch (error) {
    console.error("Error fetching global headers:", error);
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
    await ensureUser(user.uid, user.email || "");

    const headers: { key: string; value: string; isEnabled: boolean }[] =
      await req.json();

    // Replace all global headers for user
    await prisma.globalHeader.deleteMany({ where: { userId: user.uid } });

    const created = await prisma.globalHeader.createMany({
      data: headers.map((h) => ({
        key: h.key,
        value: h.value,
        isEnabled: h.isEnabled,
        userId: user.uid,
      })),
    });

    return NextResponse.json({ count: created.count });
  } catch (error) {
    console.error("Error saving global headers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
