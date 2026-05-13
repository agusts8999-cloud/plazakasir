import { db } from "@/lib/db";
import { pages as pagesSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function PublicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const page = (await db.select().from(pagesSchema).where(eq(pagesSchema.slug, slug)).limit(1))[0];

  if (!page) return notFound();

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-12 border-b pb-8">
           {page.title}
        </h1>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <div className="mt-20 pt-10 border-t border-border flex items-center justify-between text-xs text-muted-foreground italic">
           <span>Terakhir diperbarui: {page.updatedAt?.toLocaleDateString("id-ID")}</span>
           <span>PlazaKasir - Digital Solution</span>
        </div>
      </div>
    </div>
  );
}
