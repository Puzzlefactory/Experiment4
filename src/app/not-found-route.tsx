import { Link } from 'react-router'
import { Button, Card, CardContent, Stack } from '@klt-ui/design-system'
import { Page } from './layouts/page'
import styles from './routes.module.css'

export default function NotFoundRoute() {
  return (
    <Page title="Page not found" description="This route does not exist yet.">
      <Card>
        <CardContent>
          <Stack gap="md">
            <p className={styles.bodyText}>
              Add new pages by creating a feature-owned route module and wiring
              it in `src/app/routes.ts`.
            </p>
            <Button asChild appearance="filled" intent="primary">
              <Link to="/">Back to dashboard</Link>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}
