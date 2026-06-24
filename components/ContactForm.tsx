'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

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

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categorySubject: string) => {
    setSubject(categorySubject);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? '送信に失敗しました。しばらくしてから再試行してください。');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('ネットワークエラーが発生しました。接続を確認してから再試行してください。');
      setStatus('error');
    }
  };

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
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.subject)}
                  className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  このカテゴリで問い合わせ →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div ref={formRef} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-slate-800 mb-5">お問い合わせフォーム</h2>

        {status === 'success' ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-lg font-semibold text-green-700 mb-2">送信が完了しました</p>
            <p className="text-sm text-slate-500 mb-6">
              お問い合わせありがとうございます。<br />
              内容を確認のうえ、返信先メールアドレスにご連絡いたします。
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              続けてお問い合わせする
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from real users */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="website">ウェブサイト（入力しないでください）</label>
              <input
                id="website"
                name="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="例：田中 太郎"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  返信先メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="例：example@email.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  件名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="例：【改善要望】表示についての提案"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={5000}
                  rows={6}
                  placeholder="お問い合わせ内容を詳しく入力してください"
                  className={`${inputClass} resize-y`}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{message.length} / 5000</p>
              </div>
            </div>

            {status === 'error' && errorMsg && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {status === 'loading' ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </div>

      {/* Notes */}
      <div className="bg-slate-50 rounded-xl p-5 text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-600">ご注意事項</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>個人情報（氏名・連絡先・物件情報等）はお問い合わせ内容に記載しないようご注意ください</li>
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
