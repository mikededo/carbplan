# Kilo Agent Guide

## Skill Triggers

Load `.agents/skills/kilo-design/SKILL.md` when shaping, implementing, reviewing, or polishing user-facing UI in:
- `apps/web`
- `apps/static`
- `packages/ui`

Skip it for backend-only work, tests-only work, generated files, and telemetry-only work.

## Repo Conventions

Use `jj` for version control.

## Translation Conventions

- Source messages live in `apps/static/messages/*.json`.
- Generated Paraglide output lives in `apps/static/src/lib/domain/i18n`; never edit it directly.
- Use flat `snake_case` keys only.
- Do not use nested keys; Paraglide recommends flat message IDs.
- Scope keys by feature or route first, then intent: `landing_hero_title`, `tools_card_open_tool`, `demo_paraglide_link`.
- Reuse a key only when the text means the same thing in every context.
- Prefer stable semantic names over English-copy names: `pricing_month_suffix`, not `per_month`.
- Keep placeholders named for meaning: `user_email` uses `{email}`, not `{value}`.

## Area Guides

For Svelte app conventions, read `apps/web/AGENTS.md`.
