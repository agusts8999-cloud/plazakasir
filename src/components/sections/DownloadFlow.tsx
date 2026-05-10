"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Download, Instagram, Youtube, CheckCircle2, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DownloadFlow({ productName }: { productName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Initial, 2: Following, 3: Key Revealed
  const [hasClickedSocial, setHasClickedSocial] = useState(false);

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank");
    setHasClickedSocial(true);
    // Move to verification step after small delay
    setTimeout(() => setStep(2), 500);
  };

  const revealKey = () => {
    setStep(3);
  };

  const generateKey = () => {
    return "PK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        size="lg" 
        className="w-full rounded-2xl h-14 text-base font-bold shadow-xl shadow-primary/20 flex gap-2 group"
      >
        <Download size={20} className="group-hover:translate-y-1 transition-transform" /> 
        Download Sekarang
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Dapatkan Product Key</DialogTitle>
              <DialogDescription className="text-white/70">
                Follow sosial media kami untuk mendapatkan kunci aktivasi gratis.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    Silakan follow salah satu akun kami untuk melanjutkan:
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialClick("https://instagram.com/plazakasir")}
                      className="h-14 rounded-2xl border-2 flex justify-start gap-4 px-6 hover:bg-primary/5 hover:border-primary transition-all group"
                    >
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                        <Instagram size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Follow Kami di</p>
                        <p className="font-bold">Instagram</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialClick("https://tiktok.com/@plazakasir")}
                      className="h-14 rounded-2xl border-2 flex justify-start gap-4 px-6 hover:bg-primary/5 hover:border-primary transition-all group"
                    >
                      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <span className="font-bold">T</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Follow Kami di</p>
                        <p className="font-bold">TikTok</p>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Terima Kasih!</h3>
                    <p className="text-sm text-muted-foreground">
                      Kami mendeteksi Anda telah membuka link sosial media. Klik tombol di bawah untuk klaim kunci aktivasi.
                    </p>
                  </div>
                  <Button onClick={revealKey} className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg">
                    Klaim Product Key
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="p-6 bg-secondary/50 rounded-3xl border-2 border-dashed border-primary/30 text-center relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Product Key Anda</p>
                     <p className="text-3xl font-black tracking-widest font-mono text-primary">{generateKey()}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Gunakan key ini saat pertama kali membuka aplikasi.</span>
                    </div>
                    <Button className="w-full h-14 rounded-2xl font-bold flex gap-2">
                       <Download size={20} /> Download Installer (.exe)
                    </Button>
                    <p className="text-[10px] text-center font-bold uppercase tracking-widest text-muted-foreground">
                       Pastikan Anda sudah mengunduh file aplikasi.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
