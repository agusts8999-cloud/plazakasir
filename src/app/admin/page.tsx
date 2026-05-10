import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Download, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  // Mock statistics for now
  const stats = [
    { name: "Total Produk", value: "12", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Total Download", value: "1,240", icon: Download, color: "text-green-600", bg: "bg-green-100" },
    { name: "User Terdaftar", value: "482", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Pertumbuhan", value: "+12.5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const recentActivities = [
    { user: "Toko Berkah", action: "Download Kasir Pintar", time: "2 menit yang lalu" },
    { user: "Laundry Jaya", action: "Register Akun", time: "15 menit yang lalu" },
    { user: "Bengkel Maju", action: "Download Bengkel Ku", time: "1 jam yang lalu" },
    { user: "Admin", action: "Update Setting Website", time: "3 jam yang lalu" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Selamat datang kembali di Control Center PlazaKasir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.name} className="rounded-3xl border-none shadow-xl shadow-primary/5 group hover:shadow-primary/10 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                   <ArrowUpRight size={12} /> 5%
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{item.name}</p>
                <h3 className="text-2xl font-black">{item.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
          <CardHeader className="p-8 pb-4">
            <CardTitle>Aktivitas Terakhir</CardTitle>
            <CardDescription>Log interaksi user di website Anda hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="space-y-6">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-xs">
                        {act.user[0]}
                     </div>
                     <div>
                        <p className="text-sm font-bold">{act.user}</p>
                        <p className="text-xs text-muted-foreground">{act.action}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{act.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="p-8 pb-4 relative z-10">
            <CardTitle className="text-white">Tips Digitalisasi</CardTitle>
            <CardDescription className="text-white/70 text-sm">Gunakan fitur promosi untuk meningkatkan download.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 relative z-10 space-y-6">
            <p className="text-sm opacity-90 leading-relaxed">
              Tahukah Anda? Software dengan diskon 20% memiliki tingkat klaim product key 3x lebih tinggi dibanding software gratis tanpa promosi.
            </p>
            <button className="w-full h-12 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all">
              Pelajari Strategi
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
