# Prototyper Guidelines

## Critical Make Compatibility Rule

Keep the Make/Vite entrypoint shape in place:

- `index.html` loads `/src/main.tsx`
- `src/main.tsx` renders `src/app/App.tsx`
- `src/app/App.tsx` renders the React Router provider
- `src/app/layouts/app-frame.tsx` owns the Kultera app shell through
  `@klt-ui/composition/AppFrame`

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
- Page setup: route modules use `Page fill`, `Page.Header`, `Page.Body`, and
  `Page.Footer` from `@klt-ui/design-system`
- Theme provider: `@klt-ui/composition/AppFrame`
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

- Use `@klt-ui/composition/AppFrame` for the app shell.
- Do not recreate `AppFrame` with local CSS, local grids, sidebars, drawers, or
  app-level wrapper components.
- Use brand `"le"` for this starter.
- Use `HeaderBar` and `NavLinks` from `@klt-ui/design-system` for primary
  navigation inside the `AppFrame` header slot.
- Wrap the app shell in `ModalManagerProvider`.
- Portal shell dropdowns and modals into the AppFrame overlay root through
  `useAppFrameOverlayRoot()` when the component API accepts `portalContainer`.
- When a dropdown action opens a modal, open the modal after the dropdown closes
  instead of opening both overlay layers in the same event turn.
- Use route-level `Page fill`, `Page.Header`, `Page.Body`, and `Page.Footer`.
- Use `FooterBar` from `@klt-ui/design-system` through the local
  `src/app/shared/ui/app-footer.tsx` wrapper.
- Use `@klt-ui/design-system` components for app-owned UI.
- Use Kultera layout primitives first: `Container`, `Stack`, `Inline`, `Grid`,
  `Panel`, and `Card`.
- Use Kultera controls and feedback components first: `Button`, `Input`,
  `Select`, `Badge`, `DropdownMenu`, and `Modal`.
- Do not import MUI in app-owned route, layout, feature, shared, or auth code
  unless the user explicitly asks for a MUI experiment.
- Do not use MUI `sx`.
- Do not use Tailwind utility classes in app-owned code.
- Keep CSS light, local, and token-based. CSS modules are acceptable for route
  hero layout, small brand marks, and footer details that the component API does
  not cover.
- Keep custom component APIs restrictive. Do not expose arbitrary styling escape
  hatches unless the user explicitly asks for a lower-level prototype.

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
- MUI imports in app-owned code.
- `sx` props.
- Local recreation of `AppFrame`.
- Local page wrapper components that hide the `Page.Header` / `Page.Body` /
  `Page.Footer` pattern.
- Component-level fetches.
- Giant hooks that coordinate app data.
- New login routes.
- Direct imports from `src/app/shared/backend/fake-data.ts` into UI.
- Replacing the app shell instead of extending it.
- Changing package or Vite/React Router config without asking.
