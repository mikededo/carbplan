# Kilo Design Reference

Kilo uses a compact, precise, neutral UI with slate-blue accents. The product should feel calm and operational: clear hierarchy, dense but readable layouts, and minimal decoration.

## Principles

- Prefer clarity over visual flourish.
- Use neutral surfaces, thin borders, and restrained slate-blue accents.
- Keep controls compact and aligned to a 4px spacing rhythm.
- Make the primary action obvious, but do not make every action loud.
- Preserve accessible labels, focus states, and contrast.

## Color

- Use semantic Tailwind tokens first: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`.
- Use Kilo gray and slate scales only when semantic tokens are not specific enough.
- Do not use raw hex or OKLCH in app components. Add or adjust tokens in `packages/ui/src/styles.css` instead.

## Layout

- Use 4px rhythm spacing: `gap-1`, `gap-2`, `gap-3`, `p-2`, `p-3`, `px-3`, `py-2` before larger values.
- Prefer compact rows, cards, panels, tables, and forms.
- Use borders and subtle surface changes before shadows.
- Keep one primary action per view, usually a slate action such as `Create Plan`, `Save Zones`, or `Add Supplement`.

## Components

- Use `@kilo/ui` components before custom markup.
- Match existing shadcn-style component APIs and variants.
- Avoid new one-off variants unless a component already needs them.
- Use visible focus rings and keyboard-accessible controls.

## Copy

- Use concrete Kilo nouns: plan, supplement, zone, athlete, workout, serving.
- Prefer concise verbs: `Create Plan`, `Delete Supplement`, `Save Zones`, `Add Serving`, `Update Athlete`.
- Empty states should say what is missing and what to do next.
- Errors should name the failed action and the recovery path when known.
