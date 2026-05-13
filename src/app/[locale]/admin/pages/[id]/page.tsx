import { db } from "@/lib/db";
import { pages as pagesSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditPageForm } from "./EditPageForm";

export default async function EditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const page = (await db.select().from(pagesSchema).where(eq(pagesSchema.id, id)).limit(1))[0];

  if (!page) return notFound();

  return <EditPageForm page={page} />;
}
