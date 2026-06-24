export type ArticleCategory = '基礎知識' | '計算・分析' | 'リスク管理';

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
}

export const ARTICLES: Article[] = [
  {
    slug: 'gross-yield',
    title: '表面利回りとは？計算方法と目安をわかりやすく解説',
    description:
      '不動産投資の基本指標「表面利回り」の意味・計算式・エリア別目安を初心者向けに解説。実質利回りとの違いや、高利回り物件を見るときの注意点も紹介します。',
    category: '基礎知識',
  },
  {
    slug: 'surface-yield-basics',
    title: '表面利回りとは？計算方法と目安をわかりやすく解説',
    description:
      '不動産投資の第一歩として必ず確認する「表面利回り」の意味・計算式・目安を初心者向けに解説します。高利回り物件の注意点も合わせて紹介。',
    category: '基礎知識',
  },
  {
    slug: 'net-yield',
    title: '実質利回りとは？表面利回りとの違いと計算方法',
    description:
      '管理費・修繕費・税金・空室率を考慮した「実質利回り（ネット利回り）」の計算方法と、表面利回りとの差が生まれる理由を具体例つきで解説します。',
    category: '基礎知識',
  },
  {
    slug: 'net-yield-vs-surface-yield',
    title: '実質利回りとは？表面利回りとの違いと計算方法',
    description:
      '管理費・修繕費・税金・空室を考慮した「実質利回り（ネット利回り）」の計算方法と、表面利回りとの差が生まれる理由を具体例つきで解説します。',
    category: '基礎知識',
  },
  {
    slug: 'cash-flow',
    title: '不動産投資のキャッシュフロー計算方法と改善のポイント',
    description:
      'ローン返済後に毎月手元に残るお金（CF）の計算方法を解説。月間・年間CFの目安と、空室・修繕を見込んだ現実的な計算の考え方を紹介します。',
    category: '計算・分析',
  },
  {
    slug: 'cashflow-calculation',
    title: '不動産投資のキャッシュフロー計算方法と改善のポイント',
    description:
      'ローン返済後に毎月手元に残るお金（CF）の計算方法を解説。月間・年間CFの目安と、CFをプラスに改善するための具体的な方法を紹介します。',
    category: '計算・分析',
  },
  {
    slug: 'vacancy-rate',
    title: '空室率が収益に与える影響｜損益分岐ラインの考え方',
    description:
      '空室率が1%変わると収益はどう変わるか。損益分岐空室率の意味と計算方法、空室リスクへの備え方を具体的なシミュレーション例をもとに解説します。',
    category: '計算・分析',
  },
  {
    slug: 'vacancy-rate-impact',
    title: '空室率が収益に与える影響｜損益分岐ラインの考え方',
    description:
      '空室率が1%変わると収益はどう変わるか。損益分岐空室率の計算方法と、空室リスクへの備え方を具体的なシミュレーション例をもとに解説します。',
    category: '計算・分析',
  },
  {
    slug: 'investment-decision',
    title: '不動産投資で買ってはいけない物件の特徴5選',
    description:
      '利回りが高く見えても避けるべき物件には共通した特徴があります。利回り・CF・空室リスク・修繕費・出口戦略の観点から、失敗しない物件選びの判断基準を解説します。',
    category: 'リスク管理',
  },
  {
    slug: 'properties-to-avoid',
    title: '不動産投資で買ってはいけない物件の特徴5選',
    description:
      '利回りが高く見えても避けるべき物件には共通した特徴があります。築古・地方・管理不全など、失敗事例から学ぶリスクの見分け方を解説します。',
    category: 'リスク管理',
  },
];
