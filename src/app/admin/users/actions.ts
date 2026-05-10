"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(data: any) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: data.roleId,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal membuat user." };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const updateData: any = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal memperbarui user." };
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  try {
    await db.update(users).set({ roleId }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui role." };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus user." };
  }
}
