# Recipe: Review Architecture

Use this after a large Make-generated change.

## Prompt

Review the current changes against `guidelines/Guidelines.md`.

Report any drift in:

- React Router route modules
- `clientLoader` and `clientAction` usage
- feature/shared boundaries
- auth/session/permission checks
- API and fake backend boundaries
- MUI theme/component usage
- Tailwind or ad hoc CSS usage

Do not rewrite the app yet. List the issues first, then propose the smallest
repair plan.
