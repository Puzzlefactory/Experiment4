# Prototyper Guidelines

## Critical Make Compatibility Rule

Keep the Make/Vite entrypoint shape in place:

- `index.html` loads `/src/main.tsx`
- `src/main.tsx` renders `src/app/App.tsx`
- `src/app/App.tsx` installs providers and renders the React Router provider

Figma Make expects this entrypoint shape. Do not convert this project to React
Router framework mode, do not delete `src/main.tsx`, and do not replace
`src/app/App.tsx` with framework files.

Keep the `src/app/components/` directory and its contents in place. Figma Make
expects this scaffold to exist, and removing it has caused Make sessions to fail
or behave unpredictably in past projects.

Treat `src/app/components/` as Make platform compatibility scaffold, not as the
primary app architecture. Do not delete, move, or rewrite it unless the user
explicitly asks for a scaffold change.

This project already has its baseline architecture. Do not recreate it. Preserve
and extend the existing patterns.

## First Response

Before coding, inspect the relevant files and briefly tell the user:

- which route module you will change or add
- which feature/shared folder owns the work
- which route `loader` or `action` will handle data or mutations
- which shared API/backend/auth boundary will be used

If a request would require changing dependencies, build config, routing mode, or
the app frame, ask before making that change.

## Architecture Rules

- Use React Router 7 data router inside the Make-compatible Vite entrypoint.
- Route data uses route `loader` functions and mutations use route `action`
  functions.
- Do not fetch route data in components.
- Do not use `useEffect` as a data-loading or mutation orchestration layer.
- Keep route modules under `src/app/routes/`.
- Keep product/domain code under `src/app/features/`.
- Keep auth, API, fake backend, permissions, theme, and state boundaries under
  `src/app/shared/` or `src/app/`.
- Do not import fake data directly into UI components. Go through the shared API
  boundary.
- Do not create cross-feature imports. Shared behavior belongs in shared layers.

## Existing Patterns To Follow

- App shell/layout: `src/app/layouts/app-frame.tsx`
- Page header/content wrapper: `src/app/layouts/page.tsx`
- Theme: `src/app/theme.ts`
- App entry: `src/app/App.tsx`
- Route registry: `src/app/routes.tsx`
- Loader-backed page: `src/app/routes/dashboard-route.tsx`
- Action-backed form: `src/app/routes/projects-index-route.tsx`
- Feature API wrapper: `src/app/features/projects/projects-api.ts`
- Fake backend: `src/app/shared/backend/fake-backend.ts`
- Role switcher/auth session: `src/app/shared/auth/role-switcher-dialog.tsx`
- Role and permission definitions: `src/app/shared/auth/roles.ts`
- Make compatibility components: `src/app/components/`

Copy the pattern, not the example domain.

## Design System Rules

- Use MUI components and the shared theme.
- Do not use Tailwind utility classes in app-owned code.
- Do not add one-off CSS files for feature styling.
- Prefer app-level wrappers such as `Page` and `AppFrame` before inventing new
  layout structures.
- Use MUI `sx` only for layout glue such as spacing, alignment, grid, and
  responsive sizing.
- Do not use `sx` for one-off colors, typography, shadows, borders, or visual
  design decisions. Put reusable visual choices in the theme or a shared
  component.

## Auth And Permissions

- Use the role switcher modal instead of creating login pages or fake login
  forms.
- Seed roles are defined in `src/app/shared/auth/roles.ts`.
- The user/prototyper may add, remove, or rename roles, but keep permissions
  explicit.
- Use permission helpers and API/backend checks. Do not hide permissions as
  scattered component conditionals.
- When the user describes role restrictions, update the role/permission model as
  part of the same change.

## When Adding A Feature

1. Add or update the route in `src/app/routes.tsx`.
2. Add a route module in `src/app/routes/`.
3. Put domain types, API wrappers, and components under `src/app/features/<feature>/`.
4. Use a route `loader` for data and a route `action` for mutations.
5. Route modules call feature API wrappers.
6. Feature API wrappers call the shared API client.
7. The shared API client calls the fake backend.
8. The fake backend enforces auth and permissions.

## Things To Avoid

- Tailwind classes.
- Component-level fetches.
- Giant hooks that coordinate app data.
- New login routes.
- Direct imports from `src/app/shared/backend/fake-data.ts` into UI.
- Replacing the app shell instead of extending it.
- Changing package or Vite/React Router config without asking.
