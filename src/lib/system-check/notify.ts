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

/**
 * Formatiert den Report als HTML für Email-Versand
 */
export function formatReportAsHtml(report: {
  scores_json: any;
  insights_json: any;
  ai_json: any;
}, session: {
  token: string;
  name?: string | null;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
}): string {
  const axisScoresArr = report.scores_json?.axisScores?.axisScores ?? report.scores_json?.axisScores ?? [];
  const insights = report.insights_json;
  const ai = report.ai_json;

  const axisScoresHtml = axisScoresArr.map((a: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #333;">${a.label}</td>
      <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-family: monospace; color: #f59e0b;">${a.score_0_100}%</td>
    </tr>
  `).join('');

  const strengthsHtml = (insights?.strengths ?? []).map((s: any) => `
    <li style="margin: 4px 0; color: #999;">${s.label} <span style="color: #f59e0b;">(${s.score_0_100}%)</span></li>
  `).join('');

  const leversHtml = (insights?.levers ?? []).map((s: any) => `
    <li style="margin: 4px 0; color: #999;">${s.label} <span style="color: #f59e0b;">(${s.score_0_100}%)</span></li>
  `).join('');

  const tensionsHtml = (insights?.tensions ?? []).map((t: any) => `
    <div style="margin: 12px 0; padding: 12px; background: #1a1a1a; border-left: 3px solid #f59e0b;">
      <strong style="color: #fff;">${t.title}</strong>
      <p style="margin: 4px 0 0 0; color: #999; font-size: 14px;">${t.text}</p>
    </div>
  `).join('');

  // Markdown zu HTML (einfache Konvertierung für Email)
  function markdownToHtml(md: string): string {
    if (!md) return '';
    return md
      .replace(/### (.*)/g, '<h3 style="color: #fff; margin-top: 20px; margin-bottom: 8px;">$1</h3>')
      .replace(/## (.*)/g, '<h2 style="color: #fff; margin-top: 24px; margin-bottom: 12px; font-size: 18px;">$1</h2>')
      .replace(/# (.*)/g, '<h1 style="color: #fff; margin-top: 28px; margin-bottom: 16px; font-size: 22px;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #f59e0b;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li style="margin: 4px 0; color: #999;">$1</li>')
      .replace(/\n\n/g, '</p><p style="margin: 8px 0; color: #ccc; line-height: 1.6;">')
      .replace(/^(.+)$/gm, '<p style="margin: 8px 0; color: #ccc; line-height: 1.6;">$1</p>');
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #ccc; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #111; padding: 24px; border-radius: 8px; }
        h1 { color: #f59e0b; margin-top: 0; }
        h2 { color: #fff; border-bottom: 1px solid #333; padding-bottom: 8px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .section { margin: 24px 0; padding: 16px; background: #1a1a1a; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>System-Check Report</h1>
        
        <div style="margin: 16px 0; padding: 12px; background: #1a1a1a; border-radius: 4px;">
          <h3 style="color: #f59e0b; margin-top: 0;">Kontaktdaten</h3>
          <p style="margin: 4px 0;"><strong>Token:</strong> <code style="background: #0a0a0a; padding: 2px 6px; border-radius: 2px;">${session.token}</code></p>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${session.name || "(nicht angegeben)"}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${session.email || "(nicht angegeben)"}</p>
          <p style="margin: 4px 0;"><strong>Firma:</strong> ${session.company || "(nicht angegeben)"}</p>
          <p style="margin: 4px 0;"><strong>Telefon:</strong> ${session.phone || "(nicht angegeben)"}</p>
        </div>

        <h2>Werte nach Achsen</h2>
        <table>
          <thead>
            <tr style="border-bottom: 2px solid #333;">
              <th style="padding: 8px; text-align: left; color: #999;">Achse</th>
              <th style="padding: 8px; text-align: right; color: #999;">Score</th>
            </tr>
          </thead>
          <tbody>
            ${axisScoresHtml}
          </tbody>
        </table>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0;">
          <div class="section">
            <h3 style="color: #f59e0b; margin-top: 0;">Stärken</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${strengthsHtml || '<li style="color: #666;">Keine Stärken erkannt</li>'}
            </ul>
          </div>
          <div class="section">
            <h3 style="color: #f59e0b; margin-top: 0;">Hebel</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${leversHtml || '<li style="color: #666;">Keine Hebel erkannt</li>'}
            </ul>
          </div>
        </div>

        ${tensionsHtml ? `
          <h2>Systemische Spannungen</h2>
          ${tensionsHtml}
        ` : ''}

        ${ai?.summary_md ? `
          <h2>Ebene 2 — Gesamtbild</h2>
          <div class="section">
            ${markdownToHtml(ai.summary_md)}
          </div>
        ` : ''}

        ${ai?.tensions_md ? `
          <h2>Ebene 2 — Dynamiken & Widersprüche</h2>
          <div class="section">
            ${markdownToHtml(ai.tensions_md)}
          </div>
        ` : ''}

        ${ai?.quick_wins_md ? `
          <h2>Ebene 2 — Quick Wins</h2>
          <div class="section" style="background: #1a1a1a; border-left: 3px solid #f59e0b;">
            ${markdownToHtml(ai.quick_wins_md)}
          </div>
        ` : ''}

        ${ai?.reflection_questions_md ? `
          <h2>Ebene 3 — Reflexionsfragen</h2>
          <div class="section">
            ${markdownToHtml(ai.reflection_questions_md)}
          </div>
        ` : ''}

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #333; color: #666; font-size: 12px;">
          <p>Report URL: <a href="https://kairos-systems-site.vercel.app/system-check/report/${session.token}" style="color: #f59e0b;">https://kairos-systems-site.vercel.app/system-check/report/${session.token}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}