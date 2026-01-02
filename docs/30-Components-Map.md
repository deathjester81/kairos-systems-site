# Components Map

## Composition
`src/app/page.tsx` orchestrates all sections.

## Navigation
`src/components/Nav.tsx`
- anchor links to section IDs

## Sections
`src/components/sections/`
- Hero.tsx
- Problem.tsx
- System.tsx
- Perspective.tsx
- HowWeWork.tsx
- SystemReflection.tsx (optional/experimental)
- People.tsx
- Contact.tsx

## Copy source of truth
`src/lib/copy.ts`
- heroCopy
- problemCopy
- systemCopy
- howCopy
- peopleCopy
- contactCopy

Rule: change text in `copy.ts`, not inside JSX.
