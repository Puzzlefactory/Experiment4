import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { Badge, Button, Card, CardContent, Inline, Stack } from '@klt-ui/design-system'
import { Page } from '@/app/layouts/page'
import { getProject } from '@/app/features/projects/projects-api'
import styles from '@/app/routes.module.css'

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
    <Page
      eyebrow="Project"
      title={project.name}
      description={project.summary}
      actions={
        <Button asChild>
          <Link to="/projects">Back to projects</Link>
        </Button>
      }
    >
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
    </Page>
  )
}
