import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '不動産投資シミュレーターのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">›</span>
        プライバシーポリシー
      </nav>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">プライバシーポリシー</h1>
      <p className="text-xs text-slate-400 mb-8">最終更新日：{new Date().getFullYear()}年</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            1. サイトについて
          </h2>
          <p>
            本サイト「不動産投資シミュレーター」（以下「本サイト」）は、不動産投資の計算ツールを無料で提供するWebサービスです。
            本プライバシーポリシーは、本サイトがどのような情報を収集し、どのように使用するかについて説明するものです。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            2. 収集する情報
          </h2>
          <p className="mb-3">本サイトは以下の情報を収集する場合があります。</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>アクセスログ情報：</strong>
              IPアドレス、ブラウザの種類・バージョン、参照元URL、アクセス日時など
            </li>
            <li>
              <strong>Cookieおよびローカルストレージ：</strong>
              本サイトは、ページ間での入力値の引き継ぎ（物件価格・家賃収入）に
              ブラウザのローカルストレージを使用しています。これは端末内のみで完結し、
              外部サーバーへの送信は行いません。
            </li>
          </ul>
          <p className="mt-3 p-3 bg-blue-50 rounded-lg text-blue-800 text-xs">
            本サイトは会員登録・ログイン機能を持たず、氏名・住所・電話番号・メールアドレスなどの
            個人を特定できる情報は収集しておりません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            3. Google アナリティクスについて
          </h2>
          <p className="mb-3">
            本サイトはサービス改善のため、Google LLC が提供する「Google アナリティクス」を
            使用する場合があります。Google アナリティクスはCookieを使用してアクセス情報（利用状況・
            端末情報など）を収集・分析します。収集された情報はGoogleのプライバシーポリシーに
            基づき管理されます。
          </p>
          <p>
            Google アナリティクスのデータ収集を無効にするには、
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mx-1"
            >
              Google アナリティクス オプトアウト アドオン
            </a>
            をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            4. Cookieについて
          </h2>
          <p>
            本サイトはGoogle アナリティクスの機能のため、Cookieを使用する場合があります。
            ブラウザの設定からCookieを無効にすることができますが、その場合一部の機能が
            正常に動作しない可能性があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            5. 第三者への情報提供
          </h2>
          <p>
            本サイトは、法令に基づく場合を除き、ユーザーの情報を第三者に提供・開示することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            6. 免責事項
          </h2>
          <p>
            本サイトの計算結果はあくまで概算・参考値であり、実際の投資成果・返済額・収益を保証するものではありません。
            本サイトは不動産投資に関する情報提供を目的としており、金融商品取引法に基づく投資助言・
            投資勧誘を行うものではありません。投資判断は必ず専門家にご相談のうえ、
            ご自身の責任においておこなってください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            7. プライバシーポリシーの変更
          </h2>
          <p>
            本プライバシーポリシーは、必要に応じて改訂することがあります。
            変更後のポリシーは本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            8. お問い合わせ
          </h2>
          <p>
            プライバシーポリシーに関するご質問・ご意見は
            <Link href="/contact" className="text-blue-600 underline mx-1">
              お問い合わせページ
            </Link>
            からご連絡ください。
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
