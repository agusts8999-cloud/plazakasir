"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, RefreshCw, X } from "lucide-react";
import { useParams } from "next/navigation";

export function AdminPreviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0); // For refreshing iframe
  const params = useParams();
  const locale = params?.locale || "id";
  
  const previewUrl = `/${locale}`;

  const refreshPreview = () => setKey(prev => prev + 1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary transition-all rounded-md h-10 px-3"
          >
            <Eye size={18} /> Pratinjau Situs
          </Button>
        }
      />
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="flex flex-col h-full bg-background">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Live Preview</DialogTitle>
                <p className="text-xs text-muted-foreground">Melihat tampilan website Anda saat ini</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pr-8">
              <Button variant="ghost" size="icon" onClick={refreshPreview} title="Refresh Preview" className="rounded-full h-9 w-9">
                <RefreshCw size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                title="Buka di Tab Baru" 
                className="rounded-full h-9 w-9"
                render={
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                  </a>
                }
              />
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-muted/30 relative">
            <iframe 
              key={key}
              src={previewUrl} 
              className="w-full h-full border-none"
              title="Website Preview"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
