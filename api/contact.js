/**
 * POST /api/contact
 * Sends two Resend emails: admin notification + client thank-you.
 * Both emails match the site language (en | pt) from the form.
 * Env: RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
 */
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function adminCopy(lang) {
  if (lang === 'pt') {
    return {
      eyebrow: 'Novo contacto',
      title: 'Chegou uma semente.',
      name: 'Nome',
      email: 'Email',
      idea: 'Ideia',
      footer: 'Responda a este email para falar com eles.',
      subject: (name) => `Novo contacto de ${name}`,
      text: ({ name, idea, email }) =>
        `Novo contacto\n\nNome: ${name}\nEmail: ${email}\nIdeia:\n${idea}\n`,
    }
  }
  return {
    eyebrow: 'New inquiry',
    title: 'A seed just landed.',
    name: 'Name',
    email: 'Email',
    idea: 'Idea',
    footer: 'Reply directly to this email to reach them.',
    subject: (name) => `New inquiry from ${name}`,
    text: ({ name, idea, email }) =>
      `New inquiry\n\nName: ${name}\nEmail: ${email}\nIdea:\n${idea}\n`,
  }
}

function clientCopy(lang, name) {
  const firstRaw = (name || '').trim().split(/\s+/)[0] || ''
  const first = escapeHtml(firstRaw)

  if (lang === 'pt') {
    return {
      subject: 'Obrigado — recebemos a sua mensagem',
      greeting: first ? `Obrigado, ${first}.` : 'Obrigado.',
      body1:
        'Recebemos a sua mensagem. Alguém do estúdio responde em breve — normalmente em poucos dias.',
      body2:
        'Enquanto isso, pode explorar o jardim em <a href="https://davdsm.pt/" style="color:#357248;text-decoration:none;">davdsm.pt</a>.',
      tagline: 'Crescido, não construído.',
      text: `Obrigado${firstRaw ? `, ${firstRaw}` : ''}.\n\nRecebemos a sua mensagem. Alguém do estúdio responde em breve.\n\nDAVDSM · davdsm.pt\n`,
    }
  }

  return {
    subject: 'Thank you — we got your message',
    greeting: `Thank you, ${first || 'there'}.`,
    body1:
      'We received your message. Someone from the studio will write back soon — usually within a couple of days.',
    body2:
      'Meanwhile, you’re welcome to browse the garden at <a href="https://davdsm.pt/" style="color:#357248;text-decoration:none;">davdsm.pt</a>.',
    tagline: 'Grown, not built.',
    text: `Thank you, ${firstRaw || 'there'}.\n\nWe received your message. Someone from the studio will write back soon.\n\nDAVDSM · davdsm.pt\n`,
  }
}

function adminEmailHtml({ name, idea, email, lang }) {
  const copy = adminCopy(lang)
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a1a0f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f5;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#357248;font-weight:600;">${copy.eyebrow}</td></tr>
        <tr><td style="padding:0 32px 24px;font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a1a0f;">${copy.title}</td></tr>
        <tr><td style="padding:0 32px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e8eee9;">
            <tr>
              <td style="padding:18px 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7a8a7e;">${copy.name}</td>
            </tr>
            <tr><td style="padding:0 0 14px;font-size:16px;color:#0a1a0f;">${escapeHtml(name)}</td></tr>
            <tr>
              <td style="padding:8px 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7a8a7e;">${copy.email}</td>
            </tr>
            <tr><td style="padding:0 0 14px;font-size:16px;color:#0a1a0f;"><a href="mailto:${escapeHtml(email)}" style="color:#357248;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
            <tr>
              <td style="padding:8px 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7a8a7e;">${copy.idea}</td>
            </tr>
            <tr><td style="padding:0 0 8px;font-size:16px;line-height:1.55;color:#0a1a0f;white-space:pre-wrap;">${escapeHtml(idea)}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 28px;font-size:13px;color:#7a8a7e;">${copy.footer}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#9aa69e;">DAVDSM · davdsm.pt</p>
    </td></tr>
  </table>
</body>
</html>`
}

function clientEmailHtml({ name, lang }) {
  const copy = clientCopy(lang, name)
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a1a0f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f5;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#357248;font-weight:600;">DAVDSM</td></tr>
        <tr><td style="padding:0 32px 18px;font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;color:#0a1a0f;">${copy.greeting}</td></tr>
        <tr><td style="padding:0 32px 24px;font-size:16px;line-height:1.65;color:#3d4a41;">${copy.body1}</td></tr>
        <tr><td style="padding:0 32px 28px;font-size:16px;line-height:1.65;color:#3d4a41;">${copy.body2}</td></tr>
        <tr><td style="padding:0 32px 32px;font-size:14px;color:#7a8a7e;font-style:italic;">${copy.tagline}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#9aa69e;">DAVDSM · Portugal</p>
    </td></tr>
  </table>
</body>
</html>`
}

function resolveLang(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
  return normalized === 'pt' || normalized.startsWith('pt-') ? 'pt' : 'en'
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toAdmin = process.env.CONTACT_TO || 'geral@davdsm.pt'
  const from = process.env.CONTACT_FROM || 'DAVDSM <geral@davdsm.pt>'

  if (!apiKey) {
    return res.status(500).json({ error: 'Email service is not configured' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
  }

  const name = String(body?.name || '').trim()
  const idea = String(body?.idea || '').trim()
  const email = String(body?.email || '').trim().toLowerCase()
  const lang = resolveLang(body?.lang)

  if (!name || name.length > 120) {
    return res.status(400).json({ error: 'Invalid name' })
  }
  if (!idea || idea.length > 4000) {
    return res.status(400).json({ error: 'Invalid idea' })
  }
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const resend = new Resend(apiKey)
  const admin = adminCopy(lang)
  const client = clientCopy(lang, name)

  try {
    const adminResult = await resend.emails.send({
      from,
      to: [toAdmin],
      replyTo: email,
      subject: admin.subject(name),
      html: adminEmailHtml({ name, idea, email, lang }),
      text: admin.text({ name, idea, email }),
    })

    if (adminResult.error) {
      console.error('Resend admin error:', adminResult.error)
      return res.status(502).json({ error: 'Failed to send admin email' })
    }

    const clientResult = await resend.emails.send({
      from,
      to: [email],
      replyTo: toAdmin,
      subject: client.subject,
      html: clientEmailHtml({ name, lang }),
      text: client.text,
    })

    if (clientResult.error) {
      console.error('Resend client error:', clientResult.error)
      return res.status(200).json({ ok: true, warning: 'Client email failed' })
    }

    return res.status(200).json({ ok: true, lang })
  } catch (err) {
    console.error('Contact API error:', err)
    return res.status(500).json({ error: 'Unexpected error' })
  }
}
