"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/logger";
import { isAdmin } from "@/lib/auth";

export async function createUser(data: any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      fullName: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: data.roleId,
    });
    await logActivity({
      action: "MENAMBAH_USER",
      entity: "User",
      details: `Menambah user baru: ${data.name} (${data.email})`
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal membuat user." };
  }
}

export async function updateUser(id: string, data: any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const updateData: any = {
      fullName: data.name,
      email: data.email,
      roleId: data.roleId,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    await logActivity({
      action: "UPDATE_USER",
      entity: "User",
      details: `Mengubah data user: ${data.name} (ID: ${id})`
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal memperbarui user." };
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    await db.update(users).set({ roleId }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui role." };
  }
}

export async function deleteUser(userId: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    // Soft delete
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, userId));
    await logActivity({
      action: "HAPUS_USER",
      entity: "User",
      details: `Menghapus user: ${user?.fullName || userId} (Soft Delete)`
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus user." };
  }
}
