"use server";

import { db } from "@/lib/db";
import { members } from "@/db/schema";
import { revalidatePath } from "next/cache";

function generateMemberCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0,10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `PK-${dateStr}-${random}`;
}

export async function registerMember(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const businessName = formData.get("businessName") as string;
  const businessCategoryId = formData.get("businessCategoryId") as string;
  const address = formData.get("address") as string;
  const website = formData.get("website") as string;

  try {
    const memberId = crypto.randomUUID();
    const memberCode = generateMemberCode();

    const [newMember] = await db.insert(members).values({
      id: memberId,
      code: memberCode,
      fullName: name,
      email,
      phone,
      businessName,
      businessCategoryId,
      address,
      website,
      status: "ACTIVE",
    }).returning();

    revalidatePath("/admin/members");
    
    return { 
      success: true, 
      data: {
        id: newMember.id,
        code: newMember.code,
        name: newMember.fullName
      } 
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === '23505') { // Postgres unique constraint violation
      return { success: false, error: "Email sudah terdaftar." };
    }
    return { success: false, error: "Terjadi kesalahan saat pendaftaran." };
  }
}
