import { Link } from 'react-router'
import { Button, Card, CardContent, Container, Page, Stack } from '@klt-ui/design-system'
import { AppFooter } from './shared/ui/app-footer'
import styles from './routes/route-pages.module.css'

export default function NotFoundRoute() {
  return (
    <Page fill>
      <Page.Header className={styles.pageHeader}>
        <Container size="xl" padX="gutter">
          <Stack gap="xs">
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.description}>This route does not exist yet.</p>
          </Stack>
        </Container>
      </Page.Header>
      <Page.Body className={styles.pageBody}>
        <Container size="xl" padX="gutter">
          <Card>
            <CardContent>
              <Stack gap="md">
                <p className={styles.bodyText}>
                  Add new pages by creating a feature-owned route module and
                  wiring it in `src/app/routes.tsx`.
                </p>
                <Button asChild appearance="filled" intent="primary">
                  <Link to="/">Back to home</Link>
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Page.Body>
      <Page.Footer>
        <AppFooter />
      </Page.Footer>
    </Page>
  )
}
