import { db } from "@/lib/db";
import { settings as settingsSchema } from "@/db/schema";
import { Globe, Mail, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SMTPForm } from "./SMTPForm";
import { WhatsAppForm } from "./WhatsAppForm";
import { SocialForm } from "./SocialForm";

export default async function IntegrationsPage() {
  const settings = await db.select().from(settingsSchema);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Social & API Integration</h1>
        <p className="text-muted-foreground">Konfigurasi API pihak ketiga dan infrastruktur pengiriman otomatis.</p>
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="bg-background border border-border p-1 h-14 rounded-2xl mb-8">
          <TabsTrigger value="social" className="rounded-xl px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Globe className="mr-2" size={16} /> Sosial Media
          </TabsTrigger>
          <TabsTrigger value="wa" className="rounded-xl px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
            <MessageSquare className="mr-2" size={16} /> WhatsApp API
          </TabsTrigger>
          <TabsTrigger value="smtp" className="rounded-xl px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Mail className="mr-2" size={16} /> SMTP Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social">
           <SocialForm initialData={settings} />
        </TabsContent>

        <TabsContent value="wa">
           <WhatsAppForm initialData={settings} />
        </TabsContent>

        <TabsContent value="smtp">
           <SMTPForm initialData={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
