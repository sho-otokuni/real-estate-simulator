import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 });
  }

  const { name, email, subject, message, honeypot } = body as Record<string, string>;

  // Honeypot: bot detected — return 200 to not reveal detection
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: '必須項目が未入力です' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: '有効なメールアドレスを入力してください' }, { status: 400 });
  }

  if (name.length > 100 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: '入力内容が長すぎます' }, { status: 400 });
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!contactEmail || !resendKey) {
    console.error('Missing CONTACT_EMAIL or RESEND_API_KEY');
    return NextResponse.json({ error: 'サーバーの設定エラーが発生しました' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from: `お問い合わせフォーム <${fromEmail}>`,
    to: contactEmail,
    replyTo: email,
    subject: `[お問い合わせ] ${subject}`,
    text: [
      `お名前: ${name}`,
      `返信先メール: ${email}`,
      `件名: ${subject}`,
      '',
      '--- お問い合わせ内容 ---',
      message,
      '----------------------',
      '',
      '※ 不動産投資シミュレーターのお問い合わせフォームから送信されました。',
    ].join('\n'),
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json(
      { error: '送信に失敗しました。しばらくしてから再試行してください。' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
