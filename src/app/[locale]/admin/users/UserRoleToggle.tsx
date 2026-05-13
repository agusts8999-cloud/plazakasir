"use client";

import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { updateUserRole } from "./actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function UserRoleToggle({ userId, currentRoleId, roles }: { userId: string; currentRoleId: string | null; roles: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(currentRoleId || "");

  const handleRoleChange = async (newRoleId: string | null) => {
    if (!newRoleId) return;
    const previousId = selectedId;
    setSelectedId(newRoleId);
    setIsLoading(true);
    
    try {
      const res = await updateUserRole(userId, newRoleId);
      if (res.success) {
        toast.success(`Role berhasil diperbarui`);
      } else {
        toast.error(res.error);
        setSelectedId(previousId); // Rollback on error
      }
    } catch (err) {
      toast.error("Kesalahan sistem.");
      setSelectedId(previousId); // Rollback on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isLoading && <Loader2 className="animate-spin text-primary shrink-0" size={14} />}
      <Select 
        value={selectedId} 
        onValueChange={handleRoleChange}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 rounded-lg border-2 w-[180px] text-xs font-bold bg-background">
          <SelectValue>
             {roles.find(r => r.id === selectedId)?.name || "Pilih Role"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-xl border-none">
          {roles.map((r) => (
            <SelectItem key={r.id} value={r.id} className="text-xs font-medium">
               {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
