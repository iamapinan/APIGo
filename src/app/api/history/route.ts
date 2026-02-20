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
    const history = await prisma.historyItem.findMany({
      where: { userId: user.uid },
      orderBy: { date: "desc" },
      take: 50, // Keep last 50 like localStorage did
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
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

    const { id, method, url, date, headers, body } = await req.json();

    const newItem = await prisma.historyItem.create({
      data: {
        id,
        method,
        url,
        date: date ? new Date(date) : undefined,
        headers: headers || undefined,
        body,
        userId: user.uid,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding history item:", error);
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
    // Clear all history
    await prisma.historyItem.deleteMany({
      where: { userId: user.uid },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
