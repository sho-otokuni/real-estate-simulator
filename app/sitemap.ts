import { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';
import { ARTICLE_CONTENT } from '@/lib/article-content';

const BASE = 'https://real-estate-simulator-five.vercel.app';

const publishedSlugs = new Set(Object.keys(ARTICLE_CONTENT));

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = ARTICLES
    .filter((a) => publishedSlugs.has(a.slug))
    .map((a) => ({
      url: `${BASE}/articles/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  return [
    { url: BASE,                           lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/tools/surface-yield`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tools/net-yield`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tools/cashflow`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/guide`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/articles`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    ...articleEntries,
    { url: `${BASE}/contact`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
