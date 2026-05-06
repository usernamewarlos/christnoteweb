import type { APIRoute } from 'astro';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'Please enter a valid email.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.WAITLIST_TO_EMAIL ?? 'hello@christnote.app';
  const fromEmail = import.meta.env.WAITLIST_FROM_EMAIL ?? 'waitlist@christnote.app';

  if (!apiKey) {
    console.warn('[waitlist] RESEND_API_KEY not set — logging signup only.');
    console.log('[waitlist] signup:', email);
    return json({ ok: true, mode: 'logged' });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Christ Note <${fromEmail}>`,
        to: [toEmail],
        subject: `New waitlist signup: ${email}`,
        text: `A new email joined the Christ Note waitlist:\n\n${email}\n\nReceived: ${new Date().toISOString()}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[waitlist] Resend failed:', res.status, detail);
      return json({ error: 'Could not record your signup. Please try again.' }, 502);
    }

    return json({ ok: true, mode: 'sent' });
  } catch (err) {
    console.error('[waitlist] Resend error:', err);
    return json({ error: 'Could not record your signup. Please try again.' }, 500);
  }
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
