import prisma from "@/utils/prisma";

/**
 * Ensures the authenticated user exists in the database.
 * Must be called before any write operation that references userId.
 */
export async function ensureUser(uid: string, email: string): Promise<void> {
  await prisma.user.upsert({
    where: { id: uid },
    update: { email },
    create: { id: uid, email },
  });
}
