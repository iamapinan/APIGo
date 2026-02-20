import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Upsert user to ensure they exist in our DB
    await prisma.user.upsert({
      where: { id: user.uid },
      update: { email: user.email || "" },
      create: { id: user.uid, email: user.email || "" },
    });

    // Fetch all collections owned by user, OR shared with user
    // To build a tree, we fetch everything and assemble it on the client/server
    const collections = await prisma.collectionItem.findMany({
      where: {
        OR: [
          { userId: user.uid },
          { shares: { some: { userEmail: user.email || "" } } },
        ],
      },
      include: {
        shares: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // We only want the root items, Prisma handles flat lists easier.
    // We'll return flat list and let frontend build the tree, OR build it here.
    // Given the frontend expects nested CollectionItem[], let's build the tree here.
    type DbItem = {
      id: string;
      name: string;
      type: string;
      method: string | null;
      url: string | null;
      body: string | null;
      headers: unknown;
      parentId: string | null;
    };

    const buildTree = (
      items: DbItem[],
      parentId: string | null = null,
    ): DbItem[] =>
      items
        .filter((item) => item.parentId === parentId)
        .map((item) => {
          const children = buildTree(items, item.id);
          const mapped: Record<string, unknown> = {
            id: item.id,
            name: item.name,
            type: item.type,
            method: item.method || undefined,
            url: item.url || undefined,
            body: item.body || undefined,
            headers: item.headers
              ? (item.headers as Record<string, unknown>[])
              : undefined,
          };
          if (item.type === "folder") {
            mapped.children = children;
          }
          return mapped as unknown as DbItem;
        });

    const tree = buildTree(collections);

    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error fetching collections:", error);
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
    const body = await req.json();
    const { id, name, type, parentId, method, url, headers, reqBody } = body;

    const newItem = await prisma.collectionItem.create({
      data: {
        id, // Frontend generates UUID
        name,
        type,
        parentId,
        method,
        url,
        headers: headers ? JSON.stringify(headers) : undefined,
        body: reqBody,
        userId: user.uid,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error creating collection item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
