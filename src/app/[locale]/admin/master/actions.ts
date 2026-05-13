"use server";

import { db } from "@/lib/db";
import { categories, licenses, releaseInfos } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { isAdmin } from "@/lib/auth";

const MASTER_BUSINESS_ID = "00000000-0000-0000-0000-000000000001";

// --- Categories ---
export async function createCategory(data: { name: string; slug: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    await db.insert(categories).values({
      id: crypto.randomUUID(),
      businessId: MASTER_BUSINESS_ID,
      name: data.name,
      slug: data.slug,
    });
    await logActivity({
      action: "MENAMBAH_KATEGORI",
      entity: "MasterData",
      details: `Menambah kategori: ${data.name}`
    });
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menambah kategori." };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    await db.update(categories).set(data).where(eq(categories.id, id));
    await logActivity({
      action: "UPDATE_KATEGORI",
      entity: "MasterData",
      details: `Mengubah kategori: ${data.name}`
    });
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui kategori." };
  }
}

export async function deleteCategory(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
    await db.update(categories).set({ deletedAt: new Date() }).where(eq(categories.id, id));
    await logActivity({
      action: "HAPUS_KATEGORI",
      entity: "MasterData",
      details: `Menghapus kategori: ${category?.name || id} (Soft Delete)`
    });
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus kategori." };
  }
}

// --- Licenses ---
export async function createLicense(data: { name: string; description: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.insert(licenses).values({
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
  });
  revalidatePath("/admin/master");
}

export async function updateLicense(id: string, data: { name: string; description: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.update(licenses).set(data).where(eq(licenses.id, id));
  revalidatePath("/admin/master");
}

export async function deleteLicense(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const license = await db.query.licenses.findFirst({ where: eq(licenses.id, id) });
    await db.update(licenses).set({ deletedAt: new Date() }).where(eq(licenses.id, id));
    await logActivity({
      action: "HAPUS_LISENSI",
      entity: "MasterData",
      details: `Menghapus lisensi: ${license?.name || id} (Soft Delete)`
    });
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus lisensi." };
  }
}

// --- Release Infos ---
export async function createReleaseInfo(data: { title: string; content: string; estimateDate: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.insert(releaseInfos).values({
    id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    estimateDate: data.estimateDate,
  });
  revalidatePath("/admin/master");
}

export async function updateReleaseInfo(id: string, data: { title: string; content: string; estimateDate: string }) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await db.update(releaseInfos).set(data).where(eq(releaseInfos.id, id));
  revalidatePath("/admin/master");
}

export async function deleteReleaseInfo(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const info = await db.query.releaseInfos.findFirst({ where: eq(releaseInfos.id, id) });
    await db.update(releaseInfos).set({ deletedAt: new Date() }).where(eq(releaseInfos.id, id));
    await logActivity({
      action: "HAPUS_INFO_RILIS",
      entity: "MasterData",
      details: `Menghapus info rilis: ${info?.title || id} (Soft Delete)`
    });
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus info rilis." };
  }
}
