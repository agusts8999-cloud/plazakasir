"use server";

import { db } from "@/lib/db";
import { pages as pagesSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updatePageAction(id: string, data: { title: string; slug: string; content: string }) {
  try {
    await db.update(pagesSchema).set({
      title: data.title,
      slug: data.slug,
      content: data.content,
      updatedAt: new Date(),
    }).where(eq(pagesSchema.id, id));

    revalidatePath(`/p/${data.slug}`);
    revalidatePath("/admin/pages");
    
    return { success: true };
  } catch (err) {
    console.error("Failed to update page:", err);
    return { success: false };
  }
}
