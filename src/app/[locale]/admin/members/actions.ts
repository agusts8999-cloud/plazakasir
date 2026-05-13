"use server";

import { db } from "@/lib/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/logger";
import { isAdmin } from "@/lib/auth";

function generateMemberCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0,10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `PK-${dateStr}-${random}`;
}

export async function createMember(formData: FormData | any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const data = formData instanceof FormData ? Object.fromEntries(formData) : formData;
  
  try {
    const memberId = crypto.randomUUID();
    const memberCode = data.code || generateMemberCode();

    await db.insert(members).values({
      id: memberId,
      code: memberCode,
      fullName: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      businessName: data.businessName as string,
      businessCategoryId: (data.businessCategoryId as string) || null,
      address: data.address as string,
      website: data.website as string,
      status: (data.status as string) || "ACTIVE",
      type: (data.type as string) || "CUSTOMER",
      username: (data.username as string) || null,
      passwordHash: (data.password as string) || null,
      isMainCompany: data.isMainCompany === "true",
    });

    if (data.isMainCompany === "true") {
      // Unset isMainCompany for others
      await db.update(members).set({ isMainCompany: false }).where(eq(members.isMainCompany, true));
      await db.update(members).set({ isMainCompany: true }).where(eq(members.id, memberId));
    }

    await logActivity({
      action: "MENAMBAH_ANGGOTA",
      entity: "Member",
      details: `Menambah anggota baru: ${data.name} (${memberCode})`
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Create member error:", error);
    if (error.code === '23505') return { success: false, error: "Email atau Kode sudah terdaftar." };
    return { success: false, error: "Gagal menambahkan anggota." };
  }
}

export async function updateMember(id: string, formData: FormData | any) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const data = formData instanceof FormData ? Object.fromEntries(formData) : formData;

  try {
    await db.update(members).set({
      fullName: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      businessName: data.businessName as string,
      businessCategoryId: (data.businessCategoryId as string) || null,
      address: data.address as string,
      website: data.website as string,
      status: data.status as string,
      type: data.type as string,
      username: (data.username as string) || null,
      isMainCompany: data.isMainCompany === "true",
      updatedAt: new Date(),
    }).where(eq(members.id, id));

    if (data.password) {
      await db.update(members).set({ passwordHash: data.password as string }).where(eq(members.id, id));
    }

    if (data.isMainCompany === "true") {
      await db.update(members).set({ isMainCompany: false }).where(eq(members.isMainCompany, true));
      await db.update(members).set({ isMainCompany: true }).where(eq(members.id, id));
    }

    await logActivity({
      action: "UPDATE_ANGGOTA",
      entity: "Member",
      details: `Mengubah data anggota: ${data.name} (ID: ${id})`
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch (error: any) {
    console.error("Update member error:", error);
    return { success: false, error: "Gagal memperbarui anggota." };
  }
}

export async function deleteMember(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const member = await db.query.members.findFirst({ where: eq(members.id, id) });
    // Soft delete
    await db.update(members).set({ deletedAt: new Date() }).where(eq(members.id, id));
    
    await logActivity({
      action: "HAPUS_ANGGOTA",
      entity: "Member",
      details: `Menghapus anggota: ${member?.fullName || id} (Soft Delete)`
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}
