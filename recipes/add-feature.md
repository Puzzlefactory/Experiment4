# Recipe: Add A Feature

Use this when adding a product capability to the existing prototype.

## Prompt

Read `guidelines/Guidelines.md` first.

Add this feature:

`[describe the feature]`

Before coding, summarize:

- the route module you will add or change
- the feature folder that will own the domain code
- the `clientLoader` and/or `clientAction` that will handle data
- the shared API/backend/auth boundary you will use

Follow the existing app frame, page, theme, role switcher, API, and fake backend
patterns. Do not use Tailwind utility classes.

## Expected Result

- Route module lives under `src/app/routes/`.
- Domain code lives under `src/app/features/<feature>/`.
- Route data uses `clientLoader`.
- Mutations use `clientAction`.
- UI components do not fetch data directly.
- Fake data is only reached through the shared API/backend boundary.
