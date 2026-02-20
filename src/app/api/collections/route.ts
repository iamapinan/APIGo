import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth-server";
import prisma from "@/utils/prisma";
import { ensureUser } from "@/utils/ensure-user";
import { CollectionItem } from "@/utils/postman-parser";

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureUser(user.uid, user.email || "");

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
    await ensureUser(user.uid, user.email || "");

    const body = await req.json();
    const {
      id,
      name,
      type,
      parentId,
      method,
      url,
      headers,
      body: reqBody,
    } = body;

    const newItem = await prisma.collectionItem.create({
      data: {
        id, // Frontend generates UUID
        name,
        type,
        parentId,
        method,
        url,
        headers: headers || undefined,
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

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureUser(user.uid, user.email || "");
    const items = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Expected an array" }, { status: 400 });
    }

    // Recursive upsert function
    const upsertItems = async (
      collectionItems: CollectionItem[],
      parentId: string | null = null,
    ) => {
      for (const item of collectionItems) {
        await prisma.collectionItem.upsert({
          where: { id: item.id },
          update: {
            name: item.name,
            method: item.method,
            url: item.url,
            body: item.body,
            headers: item.headers || undefined,
            parentId: parentId,
          },
          create: {
            id: item.id,
            name: item.name,
            type: item.type,
            method: item.method,
            url: item.url,
            body: item.body,
            headers: item.headers || undefined,
            parentId: parentId,
            userId: user.uid,
          },
        });

        if (item.children && item.children.length > 0) {
          await upsertItems(item.children, item.id);
        }
      }
    };

    await upsertItems(items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error importing collections:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
