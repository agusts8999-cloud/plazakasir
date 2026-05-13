import { createNavigation } from 'next-intl/navigation';

export const locales = ['id', 'en', 'zh', 'ar'] as const;
export const localeNames = {
  id: 'Bahasa Indonesia',
  en: 'English',
  zh: 'Mandarin (中文)',
  ar: 'Arabic (العربية)',
};

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({ locales });
