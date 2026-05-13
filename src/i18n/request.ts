import { getRequestConfig } from 'next-intl/server';
import { locales } from '../navigation';

export default getRequestConfig(async (params) => {
  const locale = params.locale || 'id';
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    return {
      locale: 'id',
      messages: (await import(`../../messages/id.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
