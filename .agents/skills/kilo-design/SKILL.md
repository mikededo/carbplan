# Kilo Design

Use this skill when shaping, implementing, reviewing, or polishing user-facing UI in `apps/web`, `apps/static`, or `packages/ui`.

Skip backend-only work, tests-only work, generated files, and telemetry-only work.

## References

- `references/design.md` for the light theme and product UI direction.
- `references/design.dark.md` for dark mode behavior.
- `packages/ui/src/styles.css` for shared Tailwind and shadcn theme tokens.
- `apps/web/AGENTS.md` for Svelte, repo, and app conventions.

## Modes

Default to `implement` unless the user asks for another mode.

- `implement`: apply the Kilo theme while building UI.
- `review`: find theme and design violations without editing.
- `copy`: fix user-facing labels, errors, empty states, and accessible names.

## Rules

- Use `@kilo/ui` components before custom markup.
- Use semantic theme classes before raw colors.
- Do not use raw hex or OKLCH in app components unless updating `packages/ui/src/styles.css`.
- Do not introduce a new visual pattern if an existing `@kilo/ui` component or theme pattern covers it.
- Use one primary slate action per view.
- Use compact spacing from the 4px rhythm.
- Prefer borders and surface steps over shadows.
- Verify light and dark mode for any visual change.
- Preserve visible focus states.
- Do not remove accessibility basics.

## Verification

After implementation, run `bun lint`.

If CSS or theme changes are included, also run when feasible:
- `bun --cwd apps/web check`
- `bun --cwd apps/static check`
