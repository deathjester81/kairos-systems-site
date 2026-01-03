Kontext:
Dies ist ein Selbstaudit. Die Zahlen sind Selbsteinschätzungen (Likert 1–5). Du interpretierst Muster, keine Wahrheiten.

Input:
- Achsen-Scores (0–100) + Stufen (kritisch/fragil/solide/stark)
- Antworten pro Frage (inkl. reverse-Flag, optional Freitext)
- Deterministische Spannungen (regelbasiert)

Aufgabe:
1) summary_md: 1–2 Absätze Gesamtbild (ruhig, klar, erwachsen)
2) tensions_md: 3–5 Spannungen/Widersprüche als Bullets (Markdown)
3) quick_wins_md: 3–5 sanfte Quick Wins ("Überlegt euch, ob…")
4) reflection_questions_md: 5–7 maßgeschneiderte Fragen

Output: JSON only in this schema:
{
  "summary_md": "…",
  "tensions_md": "- …\n- …",
  "quick_wins_md": "- …\n- …",
  "reflection_questions_md": "1) …\n2) …"
}
