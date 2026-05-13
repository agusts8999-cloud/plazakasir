import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const dbCategories = await db.select().from(categories);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-background border border-border rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
          <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
             
             <h1 className="text-4xl font-black mb-4 relative z-10">Pendaftaran Anggota</h1>
             <p className="text-white/70 relative z-10">Bergabunglah dengan komunitas PlazaKasir dan nikmati akses eksklusif ke berbagai solusi digital.</p>
          </div>
          
          <div className="p-12">
            <RegisterForm categories={dbCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
