"use server";

import { db } from "@/lib/db";
import { categories, licenses, releaseInfos } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// --- Categories ---
export async function createCategory(data: { name: string; slug: string }) {
  await db.insert(categories).values({
    id: crypto.randomUUID(),
    name: data.name,
    slug: data.slug,
  });
  revalidatePath("/admin/master");
}

export async function updateCategory(id: string, data: { name: string; slug: string }) {
  await db.update(categories).set(data).where(eq(categories.id, id));
  revalidatePath("/admin/master");
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/master");
}

// --- Licenses ---
export async function createLicense(data: { name: string; description: string }) {
  await db.insert(licenses).values({
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
  });
  revalidatePath("/admin/master");
}

export async function updateLicense(id: string, data: { name: string; description: string }) {
  await db.update(licenses).set(data).where(eq(licenses.id, id));
  revalidatePath("/admin/master");
}

export async function deleteLicense(id: string) {
  await db.delete(licenses).where(eq(licenses.id, id));
  revalidatePath("/admin/master");
}

// --- Release Infos ---
export async function createReleaseInfo(data: { title: string; content: string; estimateDate: string }) {
  await db.insert(releaseInfos).values({
    id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    estimateDate: data.estimateDate,
  });
  revalidatePath("/admin/master");
}

export async function updateReleaseInfo(id: string, data: { title: string; content: string; estimateDate: string }) {
  await db.update(releaseInfos).set(data).where(eq(releaseInfos.id, id));
  revalidatePath("/admin/master");
}

export async function deleteReleaseInfo(id: string) {
  await db.delete(releaseInfos).where(eq(releaseInfos.id, id));
  revalidatePath("/admin/master");
}
