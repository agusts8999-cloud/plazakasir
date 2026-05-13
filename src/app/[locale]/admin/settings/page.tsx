import { db } from "@/lib/db";
import { settings as settingsSchema, pages as pagesSchema } from "@/db/schema";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settingsRaw = await db.select().from(settingsSchema);
  const pagesRaw = await db.select().from(pagesSchema);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Konfigurasi Website</h1>
        <p className="text-muted-foreground">Kelola identitas, navigasi, dan konten PlazaKasir.</p>
      </div>

      <SettingsForm initialData={settingsRaw} pages={pagesRaw} />
    </div>
  );
}
