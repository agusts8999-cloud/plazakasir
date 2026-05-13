"use client";

import { useLocale } from 'next-intl';
import { locales, localeNames, useRouter, usePathname } from '@/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // Preserve search params when switching locale
      const params = searchParams.toString();
      const targetPath = params ? `${pathname}?${params}` : pathname;
      router.replace(targetPath as any, { locale: newLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 px-3 h-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer outline-none border-none bg-transparent",
          isPending && "opacity-50 grayscale cursor-wait"
        )}
      >
        <Languages size={16} className={cn(isPending && "animate-spin")} />
        <span className="uppercase text-xs font-bold">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
        {(Object.keys(localeNames) as Array<keyof typeof localeNames>).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleLocaleChange(l)}
            className={`rounded-lg cursor-pointer flex items-center justify-between ${
              locale === l ? "bg-primary/10 text-primary font-bold" : ""
            }`}
          >
            {localeNames[l]}
            {locale === l && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
