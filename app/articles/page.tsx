import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES, type ArticleCategory } from '@/lib/articles';

export const metadata: Metadata = {
  title: '不動産投資コラム｜利回り・CF・リスク管理を解説',
  description:
    '表面利回り・実質利回り・キャッシュフロー・空室リスクなど、不動産投資に必要な知識をわかりやすく解説するコラム一覧です。',
};

const CATEGORY_STYLES: Record<ArticleCategory, string> = {
  '基礎知識': 'bg-blue-100 text-blue-700',
  '計算・分析': 'bg-green-100 text-green-700',
  'リスク管理': 'bg-amber-100 text-amber-700',
};

export default function ArticlesPage() {
  return (
    <div>
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-2">›</span>
            コラム
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">不動産投資コラム</h1>
          <p className="text-slate-500 mt-1 text-sm">
            利回り・キャッシュフロー・リスク管理など、投資判断に役立つ知識を解説します
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((article) => (
            <div
              key={article.slug}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col"
            >
              <div className="mb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[article.category]}`}
                >
                  {article.category}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-800 leading-snug mb-2">
                {article.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                {article.description}
              </p>
              <p className="mt-4 text-xs text-slate-400 italic">近日公開予定</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-blue-800 mb-1">計算ツールも合わせてご利用ください</p>
          <p className="text-xs text-blue-700 mb-4">
            記事で学んだ内容を実際の物件データで試せます
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/tools/surface-yield"
              className="bg-white border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              表面利回り計算 →
            </Link>
            <Link
              href="/tools/net-yield"
              className="bg-white border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              実質利回り計算 →
            </Link>
            <Link
              href="/tools/cashflow"
              className="bg-white border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              CF計算 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
