// Google AdSense用プレースホルダーコンポーネント
// 導入手順:
//   1. .env.local に NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX を設定
//   2. このコンポーネントに AdSense スクリプトと ins タグを実装
//   3. layout.tsx の <head> に AdSense 認証スクリプトを追加

interface AdPlaceholderProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdPlaceholder({
  slot: _slot = '0000000000',
  format: _format = 'auto',
  className: _className = '',
}: AdPlaceholderProps) {
  // NEXT_PUBLIC_ADSENSE_ID が設定されたら AdSense の ins タグを実装してください
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!adsenseId) return null;

  return null;
}
