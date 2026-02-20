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
    await ensureUser(user.uid, user.email || "");
    const environments = await prisma.environment.findMany({
      where: {
        OR: [
          { userId: user.uid },
          { shares: { some: { userEmail: user.email || "" } } },
        ],
      },
      include: { shares: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(environments);
  } catch (error) {
    console.error("Error fetching environments:", error);
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

    const { id, name, variables, headers } = await req.json();

    const newEnvironment = await prisma.environment.create({
      data: {
        id,
        name,
        variables: variables || [],
        headers: headers || undefined,
        userId: user.uid,
      },
    });

    return NextResponse.json(newEnvironment);
  } catch (error) {
    console.error("Error creating environment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
