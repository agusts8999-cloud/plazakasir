import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Users, 
  LogOut,
  Globe,
  FileText,
  Tag,
  ShieldCheck,
  Database,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/lib/version";
import { AdminPreviewModal } from "@/components/admin/AdminPreviewModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Halaman Statis", href: "/admin/pages", icon: FileText },
    { name: "Konfigurasi Web", href: "/admin/settings", icon: Settings },
    { name: "Social & API", href: "/admin/integrations", icon: Globe },
    { name: "Master Data", href: "/admin/master", icon: Database },
    { name: "Anggota", href: "/admin/members", icon: Users },
    { name: "Sistem & Log", href: "/admin/system", icon: Monitor },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border fixed h-full z-40 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border mb-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">PlazaKasir</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto thin-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 space-y-2 border-t border-border">
             <AdminPreviewModal />
             <div className="px-3 py-2 bg-secondary/50 rounded-md border border-border flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Version</span>
                <span className="text-[10px] font-bold text-primary">v{APP_VERSION}</span>
             </div>
             <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-md h-10 px-3">
                <LogOut size={18} /> Logout
             </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
