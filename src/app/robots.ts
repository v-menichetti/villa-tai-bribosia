import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return site.indexable
    ? {
        rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
        sitemap: new URL('/sitemap.xml', site.url).href,
      }
    : { rules: { userAgent: '*', disallow: '/' } };
}
