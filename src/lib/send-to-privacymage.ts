/**
 * Send a message to privacymage (mage@agentprivacy.ai).
 * Uses NEXT_PUBLIC_EMAIL_API_URL, then EmailJS, then mailto fallback.
 * Same flow as the MagePanel contact form (email recall).
 */

export interface SendToPrivacymageOptions {
  subject: string;
  body: string;
  /** If provided, uses API or EmailJS when configured; otherwise mailto only. */
  fromEmail?: string;
  replyTo?: string;
}

export async function sendToPrivacymage(options: SendToPrivacymageOptions): Promise<void> {
  const { subject, body, fromEmail, replyTo } = options;
  const hasFrom = Boolean(fromEmail?.trim());
  const reply = (replyTo ?? fromEmail)?.trim() ?? '';

  const emailApiUrl = process.env.NEXT_PUBLIC_EMAIL_API_URL || '';
  if (hasFrom && emailApiUrl) {
    const response = await fetch(emailApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'mage@agentprivacy.ai',
        from: fromEmail!.trim(),
        subject,
        text: body,
        replyTo: reply,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to send email' }));
      throw new Error(errorData.error || 'Failed to send email');
    }
    return;
  }

  const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
  if (hasFrom && emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          to_email: 'mage@agentprivacy.ai',
          from_email: fromEmail!.trim(),
          subject,
          message: body,
          reply_to: reply,
        },
      }),
    });
    if (!response.ok) throw new Error('Failed to send email via EmailJS');
    return;
  }

  // Fallback: mailto (works with or without from; user can send from their client)
  const mailtoLink = `mailto:mage@agentprivacy.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}
