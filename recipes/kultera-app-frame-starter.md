# Kultera AppFrame Starter

Use this recipe when adding or changing the starter app shell or a routed page.

## Required Shell Pattern

- Use `AppFrame` from `@klt-ui/composition`.
- Do not recreate `AppFrame` with local CSS.
- Keep the shell in `src/app/layouts/app-frame.tsx`.
- Use brand `"le"`.
- Use `layout="header-main"`.
- Pass app-specific navigation and account UI through `AppFrame` slots.
- Use `HeaderBar` and `NavLinks` from `@klt-ui/design-system` for primary navigation.
- Wrap the shell in `ModalManagerProvider`.
- Portal shell dropdowns/modals into `useAppFrameOverlayRoot()` when the package
  API accepts `portalContainer`.
- If a dropdown action opens a modal, open the modal on the next tick so the
  dropdown can close first.

```tsx
import { AppFrame, useAppFrameOverlayRoot } from '@klt-ui/composition'
import {
  DropdownMenu,
  HeaderBar,
  ModalManagerProvider,
  NavLinks,
} from '@klt-ui/design-system'

<ModalManagerProvider>
  <AppFrame
    brand="le"
    theme="light"
    density="cozy"
    layout="header-main"
    header={
      <HeaderBar
        brand={<Branding />}
        navigation={<NavLinks ariaLabel="Primary navigation" links={navLinks} />}
        actions={<AccountActions />}
      />
    }
  >
    {children}
  </AppFrame>
</ModalManagerProvider>

function AccountActions() {
  const overlayRoot = useAppFrameOverlayRoot()

  return (
    <DropdownMenu
      portalContainer={overlayRoot ?? undefined}
      // opening a modal from onAction should be deferred with setTimeout(..., 0)
    />
  )
}
```

## Required Page Pattern

Route modules should show the page slots directly.

```tsx
import { Container, Page, Stack } from '@klt-ui/design-system'
import { AppFooter } from '@/app/shared/ui/app-footer'

export default function ExampleRoute() {
  return (
    <Page fill>
      <Page.Header>
        <Container size="xl" padX="gutter">
          <Stack gap="xs">
            <h1>Page title</h1>
            <p>Page description.</p>
          </Stack>
        </Container>
      </Page.Header>
      <Page.Body>
        <Container size="xl" padX="gutter">
          {/* route content */}
        </Container>
      </Page.Body>
      <Page.Footer>
        <AppFooter />
      </Page.Footer>
    </Page>
  )
}
```

## Data Pattern

- Use React Router 7 route `loader` functions for route data.
- Use route `action` functions for mutations.
- Route modules call feature API wrappers.
- Feature API wrappers call the shared API client.
- The shared API client calls the fake backend.

## Avoid

- MUI imports.
- Tailwind utility classes in app-owned code.
- `sx` props.
- Component-level fetches.
- Local app-shell recreations.
- Hidden page wrappers that obscure `Page.Header`, `Page.Body`, or `Page.Footer`.
