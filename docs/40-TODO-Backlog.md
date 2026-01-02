# Backlog (ordered) + Definition of Done

## P0 — Make dev green
- Ensure `src/app` is the active app dir
- Ensure alias `@/*` maps to `src/*`
- Ensure `src/lib/copy.ts` exists and exports are correct
DoD: `npm run dev` runs, no runtime errors.

## P1 — InlineCTA component (optional)
- Add `src/components/InlineCTA.tsx`
- Accept props: title, description, primaryLabel, primaryHref
- Use it between key sections (Hero -> Problem, How -> Contact)
DoD: can insert CTA without duplicating markup.

## P1 — SystemReflection placeholder
- Either hide section behind a boolean flag
- Or render minimal placeholder with "coming soon"
DoD: page feels coherent with or without it.

## P2 — Replace People placeholders
- Add real names, roles, photos (or AI placeholders)
- Tighten facts (3 bullets max if needed)
DoD: People section reads premium, not CV.

## P2 — Contact wiring
- Replace placeholder href with Calendly / MS Bookings link
- Add mailto + optional phone
DoD: primary CTA works.

## P3 — Visual polish (minimal)
- Consistent spacing rhythm
- Slightly improved typography scale
- Optional subtle background accents
DoD: feels premium but still simple.
