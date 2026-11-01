import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return site.indexable
    ? [{ url: site.url.href, changeFrequency: 'monthly', priority: 1 }]
    : [];
}
