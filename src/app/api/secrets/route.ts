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
    const secrets = await prisma.secret.findMany({
      where: { userId: user.uid },
    });
    return NextResponse.json(secrets);
  } catch (error) {
    console.error("Error fetching secrets:", error);
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

    const secrets: {
      id?: string;
      key: string;
      value: string;
      isEnabled: boolean;
    }[] = await req.json();

    // Replace all secrets for user (bulk upsert approach)
    await prisma.secret.deleteMany({ where: { userId: user.uid } });

    const created = await prisma.secret.createMany({
      data: secrets.map((s) => ({
        key: s.key,
        value: s.value,
        isEnabled: s.isEnabled,
        userId: user.uid,
      })),
    });

    return NextResponse.json({ count: created.count });
  } catch (error) {
    console.error("Error saving secrets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
