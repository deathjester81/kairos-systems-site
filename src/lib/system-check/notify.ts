import { Resend } from "resend";

export async function sendInternalNotification(payload: {
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.INTERNAL_NOTIFY_EMAIL;

  // MVP fallback: wenn nicht gesetzt, nicht crashen
  if (!apiKey || !from || !to) {
    console.log("[notify] Missing RESEND_API_KEY/RESEND_FROM_EMAIL/INTERNAL_NOTIFY_EMAIL. Skipping email.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    subject: payload.subject,
    html: payload.html,
  });

  return { skipped: false };
}
