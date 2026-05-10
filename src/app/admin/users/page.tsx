import { db } from "@/lib/db";
import { users, roles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRoleToggle } from "./UserRoleToggle";
import { UserDeleteButton } from "./UserDeleteButton";
import { UserDialog } from "./UserDialog";
import { RoleDialog } from "./roles/RoleDialog";
import { User, Shield, Mail, Lock, ShieldAlert, Key } from "lucide-react";

export default async function AdminUsersPage() {
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.id)],
    with: {
        roleData: true
    }
  });

  const allRoles = await db.select().from(roles);

  return (
    <div className="space-y-16 pb-20">
      {/* Section 1: Roles Management */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <ShieldAlert size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Daftar Role & Izin Akses</h2>
                <p className="text-sm text-muted-foreground">Buat peranan khusus dengan hak akses terbatas.</p>
             </div>
          </div>
          <RoleDialog mode="add" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {allRoles.map((r) => (
             <div key={r.id} className="p-6 bg-background border border-border rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                   <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-bold">
                      {r.name}
                   </Badge>
                   <RoleDialog mode="edit" role={r} />
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                      <Key size={12} /> Izin Terdaftar:
                   </p>
                   <div className="flex flex-wrap gap-2">
                      {JSON.parse(r.permissions || "[]").map((p: string) => (
                        <span key={p} className="px-3 py-1 bg-secondary text-[10px] font-bold rounded-full capitalize">
                           {p}
                        </span>
                      ))}
                      {JSON.parse(r.permissions || "[]").length === 0 && <span className="text-xs italic text-muted-foreground">Tidak ada akses</span>}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Section 2: Users Management */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <User size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Manajemen Akun User</h2>
                <p className="text-sm text-muted-foreground">Kelola pengguna dan hubungkan dengan role di atas.</p>
             </div>
          </div>
          <UserDialog roles={allRoles} mode="add" />
        </div>

        <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="px-8 py-6 h-14">Pengguna</TableHead>
                <TableHead>Email (Login)</TableHead>
                <TableHead>Peranan (Role)</TableHead>
                <TableHead className="text-right px-8">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.id} className="group hover:bg-secondary/10 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                        {u.image ? (
                          <img src={u.image} alt={u.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <User className="text-primary opacity-50" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-tight">{u.name || "No Name"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">ID: {u.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} className="text-primary/50" />
                      {u.email}
                    </div>
                  </TableCell>
                  <TableCell>
                     <UserRoleToggle userId={u.id} currentRoleId={u.roleId} roles={allRoles} />
                  </TableCell>
                  <TableCell className="text-right px-8">
                     <div className="flex items-center justify-end gap-2">
                        <UserDialog roles={allRoles} user={u} mode="edit" />
                        <UserDeleteButton userId={u.id} />
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
