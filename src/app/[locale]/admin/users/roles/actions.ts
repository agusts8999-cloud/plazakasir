"use server";

import { db } from "@/lib/db";
import { roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";

export async function createRole(data: { name: string; permissions: string[] }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.insert(roles).values({
    id: crypto.randomUUID(),
    name: data.name,
    permissions: JSON.stringify(data.permissions),
  });
  revalidatePath("/admin/users");
}

export async function updateRole(id: string, data: { name: string; permissions: string[] }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.update(roles).set({
    name: data.name,
    permissions: JSON.stringify(data.permissions),
  }).where(eq(roles.id, id));
  revalidatePath("/admin/users");
}

export async function deleteRole(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.delete(roles).where(eq(roles.id, id));
  revalidatePath("/admin/users");
}
