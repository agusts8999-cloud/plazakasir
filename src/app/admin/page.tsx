import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Download, Users, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { db } from "@/lib/db";
import { products, users, activityLogs } from "@/db/schema";
import { sql, desc, isNull } from "drizzle-orm";

export default async function AdminDashboard() {
  // Fetch Real Stats
  const [totalProducts] = await db.select({ count: sql<number>`count(*)` }).from(products).where(isNull(products.deletedAt));
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users).where(isNull(users.deletedAt));
  const [totalActivities] = await db.select({ count: sql<number>`count(*)` }).from(activityLogs);
  
  // For downloads, we check activity logs for 'DOWNLOAD' or 'UNDUH' actions
  const [totalDownloads] = await db.select({ count: sql<number>`count(*)` })
    .from(activityLogs)
    .where(sql`action ILIKE '%DOWNLOAD%' OR action ILIKE '%UNDUH%'`);

  const stats = [
    { name: "Total Produk", value: totalProducts.count.toLocaleString("id-ID"), icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Aktivitas", value: totalActivities.count.toLocaleString("id-ID"), icon: Activity, color: "text-green-600", bg: "bg-green-50" },
    { name: "User Terdaftar", value: totalUsers.count.toLocaleString("id-ID"), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Unduh Software", value: totalDownloads.count.toLocaleString("id-ID"), icon: Download, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const recentLogs = await db.query.activityLogs.findMany({
    orderBy: [desc(activityLogs.createdAt)],
    limit: 5,
    with: {
        user: true
    }
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Analisis data real-time dari seluruh ekosistem PlazaKasir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.name} className="rounded-xl border border-border shadow-sm group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} border border-current/10`}>
                  <item.icon size={20} />
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                   <ArrowUpRight size={10} /> Live
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 opacity-70">{item.name}</p>
                <h3 className="text-2xl font-black">{item.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-xl border border-border shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-gray-50 bg-muted/20">
            <CardTitle className="text-lg">Aktivitas Sistem Terbaru</CardTitle>
            <CardDescription className="text-xs">Log interaksi real-time di seluruh platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentLogs.map((log, i) => (
                <div key={log.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-9 h-9 bg-primary/5 text-primary rounded-lg flex items-center justify-center font-bold text-[10px] border border-primary/10">
                        {log.user?.fullName?.[0] || "S"}
                     </div>
                     <div>
                        <p className="text-sm font-bold leading-none">{log.user?.fullName || "System"}</p>
                        <p className="text-xs text-muted-foreground mt-1.5">{log.action}: {log.description?.substring(0, 40)}...</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <div className="p-10 text-center text-muted-foreground text-sm">Belum ada aktivitas tercatat.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none bg-zinc-900 text-white shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />
          <CardHeader className="p-8 pb-4 relative z-10">
            <CardTitle className="text-xl font-bold">Wawasan Digitalisasi</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">Strategi optimasi marketplace Anda.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 relative z-10 space-y-6">
            <p className="text-sm text-zinc-300 leading-relaxed">
              Software dengan diskon <span className="text-primary font-bold">20%</span> memiliki tingkat konversi <span className="text-white font-bold">3x lebih tinggi</span>. Gunakan fitur promo pada Manajemen Produk untuk menarik lebih banyak pengguna hari ini.
            </p>
            <div className="pt-4">
               <button className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Lihat Tips Lengkap
               </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
