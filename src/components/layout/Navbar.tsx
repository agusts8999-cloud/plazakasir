"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

interface NavbarProps {
  siteTitle: string;
  siteLogo?: string;
  promoText?: string;
  ctaText?: string;
  navLinks?: { name: string; href: string }[];
}

export function Navbar({ siteTitle, siteLogo, promoText, ctaText, navLinks }: NavbarProps) {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Komunitas", href: "#community" },
    { name: "Tentang", href: "#about" },
  ];

  const links = navLinks && navLinks.length > 0 ? navLinks : defaultLinks;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Promo Bar */}
      {promoText && (
        <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
           <Bell size={12} className="animate-bounce" /> {promoText}
        </div>
      )}
      
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {siteLogo ? (
              <div className="h-10 w-auto">
                <img src={siteLogo} alt={siteTitle} className="h-full w-auto object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            )}
            <span className="text-xl font-bold tracking-tight text-foreground">
              {siteTitle || "PlazaKasir"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-[1px] bg-border mx-2" />
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="font-medium gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => signOut()}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Login
                </Button>
              </Link>
            )}
            <Link href="/marketplace">
              <Button size="sm" className="rounded-full px-6 font-semibold shadow-md shadow-primary/10">
                {ctaText || "Download Gratis"}
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 md:hidden shadow-xl"
            >
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">{ctaText || "Download Gratis"}</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
