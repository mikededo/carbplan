# Kilo Dark Design Reference

Dark mode keeps the same compact, precise, neutral UI with slate-blue accents. It should reduce glare without becoming high-contrast neon.

## Principles

- Use dark neutral surfaces with subtle elevation through borders and surface steps.
- Keep slate-blue accents reserved for the primary action, focus, and selected states.
- Avoid pure black backgrounds for main surfaces.
- Preserve readable contrast for muted text, borders, and disabled states.

## Color

- Use semantic Tailwind tokens first: `bg-background`, `bg-card`, `bg-popover`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`.
- Use alpha border tokens for separation before adding shadows.
- Do not place saturated slate accents across large surfaces.
- Do not use raw hex or OKLCH in app components. Update `packages/ui/src/styles.css` when a token is needed.

## Interaction

- Focus states must remain visible against dark surfaces.
- Hover states should be surface changes, not bright color fills, unless the element is the primary action.
- Destructive actions such as `Delete Supplement` should remain clearly distinct from primary actions.

## Verification

- Check the changed view in light and dark mode.
- Confirm text, borders, focus rings, disabled controls, and empty states remain legible.
