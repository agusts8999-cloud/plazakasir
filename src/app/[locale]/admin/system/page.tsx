import { db } from "@/lib/db";
import { activityLogs, users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Info, 
  RefreshCw, 
  FileText, 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { APP_VERSION, APP_NAME, APP_BUILD_DATE } from "@/lib/version";
import os from "os";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const logs = await db.query.activityLogs.findMany({
    orderBy: [desc(activityLogs.createdAt)],
    limit: 50,
    with: {
      user: true
    }
  });

  const systemInfo = {
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    nodeVersion: process.version,
    uptime: `${Math.floor(os.uptime() / 3600)} jam`,
    memory: `${Math.floor(os.totalmem() / (1024 * 1024 * 1024))} GB`,
    cpu: os.cpus()[0].model,
  };

  const changelogs = [
    { version: "1.2.4", date: "2026-05-11", changes: ["Penambahan fitur System Info & Activity Log", "Auto-versioning build script", "Fix minor UI pada admin layout"] },
    { version: "1.2.0", date: "2026-05-10", changes: ["Implementasi Membership CRUD", "Sistem cetak barcode anggota", "Riwayat pembelian pelanggan"] },
    { version: "1.1.0", date: "2026-05-09", changes: ["Migrasi ke Bun runtime", "Next.js 16 integration", "Drizzle ORM implementation"] },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Sistem & Log</h1>
        <p className="text-muted-foreground">Monitoring kesehatan sistem, riwayat pembaruan, dan log aktivitas.</p>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-lg h-11 border border-border">
          <TabsTrigger value="info" className="rounded-md h-9 px-4 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Cpu size={16} /> Info Sistem
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-md h-9 px-4 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Activity size={16} /> Activity Log
          </TabsTrigger>
          <TabsTrigger value="changelog" className="rounded-md h-9 px-4 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText size={16} /> Changelog
          </TabsTrigger>
          <TabsTrigger value="update" className="rounded-md h-9 px-4 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <RefreshCw size={16} /> Update
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-md h-9 px-4 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Info size={16} /> About
          </TabsTrigger>
        </TabsList>

        {/* --- INFO SISTEM --- */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-xl border-none shadow-md bg-zinc-900 text-white overflow-hidden relative">
               <div className="absolute -right-10 -bottom-10 opacity-5">
                  <Zap size={200} />
               </div>
               <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
                     <Settings size={14} /> Versi Aplikasi
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-4xl font-black tracking-tighter mb-1">{APP_VERSION}</p>
                  <p className="text-zinc-500 text-xs font-medium">Build Date: {APP_BUILD_DATE}</p>
                  <Badge className="mt-4 bg-blue-600 hover:bg-blue-700 border-none text-white rounded-md text-[10px] font-bold uppercase tracking-widest px-3">Stable Release</Badge>
               </CardContent>
            </Card>

            <Card className="rounded-xl border border-border shadow-sm">
               <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                     <Cpu size={16} /> Server Engine
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                     <span className="text-muted-foreground text-xs font-medium">Runtime</span>
                     <span className="font-bold text-xs">Bun v1.1+ (Next.js 16)</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                     <span className="text-muted-foreground text-xs font-medium">Node Env</span>
                     <span className="font-bold text-xs uppercase tracking-tighter">{process.env.NODE_ENV}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-muted-foreground text-xs font-medium">Memory Usage</span>
                     <span className="font-bold text-xs">{(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-xl border border-border shadow-sm">
               <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                     <HardDrive size={16} /> Infrastructure
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                     <span className="text-muted-foreground text-xs font-medium">OS</span>
                     <span className="font-bold text-[11px] truncate max-w-[140px]">{systemInfo.os}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-muted-foreground text-xs font-medium">CPU Model</span>
                     <span className="font-bold text-[10px] truncate max-w-[140px]">{systemInfo.cpu}</span>
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- ACTIVITY LOG --- */}
        <TabsContent value="activity">
          <Card className="rounded-xl border border-border shadow-sm overflow-hidden">
            <CardContent className="p-0">
               <div className="max-h-[600px] overflow-y-auto thin-scrollbar">
                  <div className="divide-y divide-border">
                     {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 p-5 hover:bg-muted/5 transition-colors group">
                           <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                              <Activity size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                 <p className="font-semibold text-sm truncate">
                                    <span className="text-primary">{log.user?.fullName || "System"}</span> <span className="text-foreground">{log.action}</span>
                                 </p>
                                 <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded">{new Date(log.createdAt).toLocaleString("id-ID")}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground font-medium">
                                 <Badge variant="outline" className="text-[10px] py-0 h-4 border-muted-foreground/20 font-bold tracking-tighter uppercase">{log.entity || "SYSTEM"}</Badge>
                                 <span>•</span>
                                 <span>IP: {log.ipAddress}</span>
                              </div>
                              {log.description && (
                                 <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50 text-[11px] font-mono text-muted-foreground leading-relaxed italic">
                                    {log.description}
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                     {logs.length === 0 && (
                        <div className="py-24 text-center text-muted-foreground">
                           <Activity size={40} className="mx-auto opacity-10 mb-3" />
                           <p className="text-sm font-medium">Belum ada log aktivitas tercatat.</p>
                        </div>
                     )}
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CHANGELOG --- */}
        <TabsContent value="changelog">
           <div className="space-y-4">
              {changelogs.map((item) => (
                 <Card key={item.version} className="rounded-xl border border-border shadow-sm">
                    <CardHeader className="pb-3">
                       <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold tracking-tight">Version {item.version}</CardTitle>
                          <Badge variant="outline" className="text-[10px] font-bold uppercase">{item.date}</Badge>
                       </div>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-2.5">
                          {item.changes.map((change, i) => (
                             <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                {change}
                             </li>
                          ))}
                       </ul>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </TabsContent>

        {/* --- UPDATE --- */}
        <TabsContent value="update">
           <Card className="rounded-xl border border-border shadow-sm p-16 text-center bg-white/50">
              <div className="max-w-md mx-auto space-y-6">
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm border border-blue-100">
                    <RefreshCw size={32} className="animate-spin-slow" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold tracking-tight">Sistem Terkini</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Pembaruan sistem dikelola secara otomatis melalui infrastruktur cloud PlazaKasir.</p>
                 </div>
                 <Button disabled className="h-10 px-8 rounded-lg font-bold text-xs gap-2">
                    <CheckCircle2 size={16} /> Versi Terbaru Terpasang
                 </Button>
              </div>
           </Card>
        </TabsContent>

        {/* --- ABOUT --- */}
        <TabsContent value="about">
           <Card className="rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="bg-zinc-900 p-10 text-white flex items-center gap-8 border-b border-zinc-800">
                 <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-2xl shrink-0">
                    <span className="text-zinc-900 text-4xl font-black">P</span>
                 </div>
                 <div>
                    <h2 className="text-2xl font-black tracking-tight">{APP_NAME}</h2>
                    <p className="text-zinc-400 text-sm font-medium mt-1">Enterprise Digital Management System</p>
                 </div>
              </div>
              <CardContent className="p-10 space-y-8">
                 <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl font-medium">
                    PlazaKasir Control Center adalah solusi manajemen pusat yang dirancang untuk skalabilitas tinggi. Platform ini mengintegrasikan marketplace aplikasi, manajemen keanggotaan, dan kontrol sistem dalam satu antarmuka yang disiplin dan aman.
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Developer</p>
                       <p className="font-bold text-sm">Antigravity AI</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Engine</p>
                       <p className="font-bold text-sm">Next.js 16.2</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Database</p>
                       <p className="font-bold text-sm">Postgres 16</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                       <p className="font-bold text-sm text-emerald-600">Stable v1.2</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
