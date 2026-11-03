import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { paths } from '@/lib/i18n';
export default function sitemap(): MetadataRoute.Sitemap {
  return site.indexable
    ? Object.values(paths).flatMap((pages) =>
        Object.values(pages).map((path) => ({
          url: new URL(path, site.url).href,
          changeFrequency: 'monthly' as const,
          priority: path === '/' || path === '/en' ? 1 : 0.7,
        })),
      )
    : [];
}
