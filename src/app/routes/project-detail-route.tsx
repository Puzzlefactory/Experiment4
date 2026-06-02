import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Container,
  Inline,
  Page,
  Stack,
} from '@klt-ui/design-system'
import { AppFooter } from '@/app/shared/ui/app-footer'
import { getProject } from '@/app/features/projects/projects-api'
import styles from './route-pages.module.css'

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.projectId) {
    throw new Response('Project id is required', { status: 400 })
  }

  return { project: await getProject(params.projectId) }
}

export default function ProjectDetailRoute() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>
  const { project } = loaderData

  return (
    <Page fill>
      <Page.Header className={styles.pageHeader}>
        <Container size="xl" padX="gutter">
          <Inline align="start" gap="md" justify="between" wrap="wrap">
            <Stack gap="xs">
              <p className={styles.eyebrow}>Project</p>
              <h1 className={styles.title}>{project.name}</h1>
              <p className={styles.description}>{project.summary}</p>
            </Stack>
            <Button asChild>
              <Link to="/projects">Back to projects</Link>
            </Button>
          </Inline>
        </Container>
      </Page.Header>
      <Page.Body className={styles.pageBody}>
        <Container size="xl" padX="gutter">
          <Card>
            <CardContent>
              <Stack gap="md">
                <Inline gap="xs" wrap="wrap">
                  <Badge>{project.status}</Badge>
                  <Badge>{project.health}</Badge>
                </Inline>
                <p className={styles.bodyText}>Owner: {project.owner}</p>
                <p className={styles.metaText}>
                  Updated: {new Date(project.updatedAt).toLocaleString()}
                </p>
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
