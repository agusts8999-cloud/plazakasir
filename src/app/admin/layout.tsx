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
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { name: "Master Data", href: "/admin/master", icon: Tag },
    { name: "Manajemen User", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="w-72 bg-background border-r border-border fixed h-full z-40 hidden md:block">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Control Center</span>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
           <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl">
              <LogOut size={18} /> Logout
           </Button>
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
