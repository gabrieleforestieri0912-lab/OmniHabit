export interface SendResetOptions {
  email: string;
  resetLink: string;
  token: string;
}

export async function sendPasswordResetEmail({ email, resetLink }: SendResetOptions): Promise<void> {
  if (!process.env.SMTP_HOST) {
    console.log('[DEV] Password reset per', email, '→', resetLink);
    return;
  }
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@omnihabit.app',
    to: email,
    subject: 'Reimposta la tua password OmniHabit',
    html: `<p>Clicca il link per reimpostare la password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Il link è valido per 1 ora.</p>`
  });
}
