import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-sm">
          <div>
            <p className="text-slate-300 font-semibold mb-2">計算ツール</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/tools/surface-yield" className="hover:text-white transition-colors">
                  表面利回り計算
                </Link>
              </li>
              <li>
                <Link href="/tools/net-yield" className="hover:text-white transition-colors">
                  実質利回り計算
                </Link>
              </li>
              <li>
                <Link href="/tools/cashflow" className="hover:text-white transition-colors">
                  ローン・CF計算
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 font-semibold mb-2">コンテンツ</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  不動産投資の基礎
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  コラム
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 font-semibold mb-2">サイト情報</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 font-semibold mb-2">サイトマップ</p>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">トップ</Link></li>
              <li><Link href="/tools/surface-yield" className="hover:text-white transition-colors">表面利回り</Link></li>
              <li><Link href="/tools/net-yield" className="hover:text-white transition-colors">実質利回り</Link></li>
              <li><Link href="/tools/cashflow" className="hover:text-white transition-colors">CF計算</Link></li>
              <li><Link href="/guide" className="hover:text-white transition-colors">ガイド</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">コラム</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシー</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-700 pt-6 text-xs text-slate-500 leading-relaxed space-y-2">
          <p className="font-semibold text-slate-400">【免責事項】</p>
          <p>
            本サイトの計算結果はあくまで概算・参考値であり、実際の投資成果・返済額・収益を保証するものではありません。
            計算式は一般的な手法に基づいていますが、金融機関・税務上の取り扱いとは異なる場合があります。
          </p>
          <p>
            本サイトは不動産投資に関する情報提供を目的としており、
            金融商品取引法に基づく投資助言・投資勧誘を行うものではありません。
            投資判断は必ず専門家（税理士・ファイナンシャルプランナー・宅地建物取引士等）にご相談のうえ、
            ご自身の責任においておこなってください。
          </p>
        </div>

        <p className="mt-6 text-xs text-slate-600 text-center">
          © {new Date().getFullYear()} 不動産投資シミュレーター
        </p>
      </div>
    </footer>
  );
}
