export default function Disclaimer() {
  return (
    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ ご利用にあたっての注意事項</p>
      <p className="text-xs text-amber-800 leading-relaxed">
        本ツールの計算結果は<strong>概算・参考値</strong>です。実際の投資成果・返済額・収益を保証するものではありません。
        本サービスは金融商品取引法に基づく投資助言・投資勧誘を行うものではありません。
        投資判断は必ず専門家にご相談のうえ、<strong>ご自身の責任</strong>においておこなってください。
      </p>
    </div>
  );
}
