import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/lib/articles';
import { ARTICLE_CONTENT } from '@/lib/article-content';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

const CATEGORY_STYLES: Record<string, string> = {
  '基礎知識': 'bg-blue-100 text-blue-700',
  '計算・分析': 'bg-green-100 text-green-700',
  'リスク管理': 'bg-amber-100 text-amber-700',
};

const TOOL_LINKS: Record<string, { href: string; label: string }> = {
  'gross-yield':                { href: '/tools/surface-yield', label: '表面利回り計算ツールで試す →' },
  'surface-yield-basics':       { href: '/tools/surface-yield', label: '表面利回り計算ツールで試す →' },
  'net-yield':                  { href: '/tools/net-yield',     label: '実質利回り計算ツールで試す →' },
  'cash-flow':                  { href: '/tools/cashflow',      label: 'CF計算ツールで試す →' },
  'vacancy-rate':               { href: '/tools/cashflow',      label: '空室率シミュレーションで試す →' },
  'investment-decision':        { href: '/tools/cashflow',      label: '購入判定ツールで物件を診断する →' },
  'net-yield-vs-surface-yield': { href: '/tools/net-yield',     label: '実質利回り計算ツールで試す →' },
  'cashflow-calculation':  { href: '/tools/cashflow',       label: 'キャッシュフロー計算ツールで試す →' },
  'vacancy-rate-impact':   { href: '/tools/cashflow',       label: 'キャッシュフロー計算ツールで試す →' },
  'properties-to-avoid':   { href: '/tools/surface-yield', label: '表面利回り計算ツールで試す →' },
};

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const content = ARTICLE_CONTENT[slug];
  const toolLink = TOOL_LINKS[slug] ?? { href: '/tools/surface-yield', label: '計算ツールで試す →' };

  const sameCategory = ARTICLES.filter((a) => a.slug !== slug && a.category === article.category);
  const otherCategory = ARTICLES.filter((a) => a.slug !== slug && a.category !== article.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

  const relatedSection = related.length > 0 ? (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <h2 className="text-base font-bold text-slate-700 mb-4">関連記事</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={`/articles/${r.slug}`}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start mb-2 ${CATEGORY_STYLES[r.category] ?? 'bg-slate-100 text-slate-600'}`}>
              {r.category}
            </span>
            <p className="text-sm font-bold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-3">
              {r.title}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
              {r.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  ) : null;

  const SITE_URL = 'https://real-estate-simulator-five.vercel.app';
  const articleUrl = `${SITE_URL}/articles/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: articleUrl,
    publisher: {
      '@type': 'Organization',
      name: '不動産投資シミュレーター',
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム',    item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '記事一覧',  item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  };

  const schemas = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );

  const header = (
    <div className="bg-white border-b border-slate-100 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-slate-500 mb-1">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <span className="mx-2">›</span>
          <Link href="/articles" className="hover:text-blue-600">コラム</Link>
          <span className="mx-2">›</span>
          {article.title}
        </p>
        <div className="mt-3 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[article.category] ?? 'bg-slate-100 text-slate-600'}`}>
            {article.category}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug mt-2">
          {article.title}
        </h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">{article.description}</p>
      </div>
    </div>
  );

  if (!content) {
    return (
      <div>
        {schemas}
        {header}
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-10">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg font-bold text-slate-700 mb-2">この記事は近日公開予定です</p>
            <p className="text-sm text-slate-500 mb-8">
              現在執筆中です。公開までしばらくお待ちください。
            </p>
            <Link
              href="/articles"
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors"
            >
              ← コラム一覧に戻る
            </Link>
          </div>
        </div>
        {relatedSection}
      </div>
    );
  }

  return (
    <div>
      {schemas}
      {header}

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {content}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-blue-600 rounded-2xl p-7 text-white text-center">
          <p className="text-lg font-bold mb-2">実際の数字で計算してみよう</p>
          <p className="text-blue-100 text-sm mb-5">
            記事で学んだ表面利回りの計算を、気になる物件の数字で試してみてください。
          </p>
          <Link
            href={toolLink.href}
            className="inline-block bg-white text-blue-600 font-semibold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            {toolLink.label}
          </Link>
        </div>

        {/* Back to list */}
        <div className="mt-8 mb-10 text-center">
          <Link href="/articles" className="text-sm text-slate-500 hover:text-blue-600 underline">
            ← コラム一覧に戻る
          </Link>
        </div>
      </div>
      {relatedSection}
    </div>
  );
}
