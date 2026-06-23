import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            ホーム
          </Link>
          <Link href="/tools/surface-yield" className="hover:text-white transition-colors">
            表面利回り計算
          </Link>
          <Link href="/tools/net-yield" className="hover:text-white transition-colors">
            実質利回り計算
          </Link>
          <Link href="/tools/cashflow" className="hover:text-white transition-colors">
            CF計算
          </Link>
          <Link href="/guide" className="hover:text-white transition-colors">
            不動産投資の基礎
          </Link>
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
