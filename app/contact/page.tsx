import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '不動産投資シミュレーターへのお問い合わせ・改善要望はこちらからどうぞ。',
};

// TODO: NEXT_PUBLIC_CONTACT_EMAIL に連絡先メールアドレスを設定してください
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

const CATEGORIES = [
  {
    icon: '💡',
    title: 'サイト改善要望',
    description: '「こんな機能があれば便利」「この表示をわかりやすくしてほしい」など、改善のご提案をお寄せください。',
    subject: '【改善要望】不動産投資シミュレーター',
  },
  {
    icon: '🐛',
    title: '不具合報告',
    description: '計算結果がおかしい、ページが正しく表示されないなど、不具合を発見した場合はご報告ください。',
    subject: '【不具合報告】不動産投資シミュレーター',
  },
  {
    icon: '❓',
    title: 'その他のご質問',
    description: '計算式の根拠、数値の見方など、ご不明な点があればお気軽にお問い合わせください。',
    subject: '【ご質問】不動産投資シミュレーター',
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">›</span>
        お問い合わせ
      </nav>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">お問い合わせ</h1>
      <p className="text-slate-500 text-sm mb-8">
        ご意見・ご要望・不具合報告をお待ちしています。いただいたフィードバックはサービス改善に活用させていただきます。
      </p>

      {/* Category cards */}
      <div className="space-y-4 mb-10">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-0.5">{cat.icon}</span>
              <div className="flex-1">
                <h2 className="font-semibold text-slate-800 mb-1">{cat.title}</h2>
                <p className="text-sm text-slate-600 mb-3">{cat.description}</p>
                {CONTACT_EMAIL ? (
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(cat.subject)}`}
                    className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    メールで送る →
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    ※ 現在受付準備中です。しばらくお待ちください。
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-slate-50 rounded-xl p-5 text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-600">ご注意事項</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>個人情報（氏名・連絡先・物件情報等）はメールに記載しないようご注意ください</li>
          <li>投資判断に関する個別アドバイスはお答えできません。専門家（税理士・FP等）にご相談ください</li>
          <li>返信には数日いただく場合があります</li>
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
