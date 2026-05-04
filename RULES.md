# FocusForge Rules

## Folder Structure
- `app/`: Next.js App Router (Auth, Student, Teacher, API).
- `components/`: Atomic UI components + Layouts.
- `lib/`: Clients and shared logic.
- `server/`: Controllers, Services, and Models (Zod).
- `hooks/`: Domain-specific hooks.
- `utils/`: XP, formatting, and penalties logic.

## Naming & Patterns
- Components: PascalCase.
- Files: kebab-case.
- Server Actions: `[feature].actions.ts`.
- Strict Type Safety: No `any`.
