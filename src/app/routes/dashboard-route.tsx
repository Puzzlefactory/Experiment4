import { Link, useLoaderData } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Inline,
  Page,
  Stack,
} from '@klt-ui/design-system'
import { AppFooter } from '@/app/shared/ui/app-footer'
import { prototypeApi } from '@/app/shared/api/prototype-api'
import type { DashboardResponse } from '@/app/shared/backend/fake-backend'
import type { Project } from '@/app/features/projects/types'
import styles from './route-pages.module.css'

export async function loader() {
  return prototypeApi.get<DashboardResponse>('/dashboard')
}

export default function DashboardRoute() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>
  const metrics = [
    { label: 'Active projects', value: loaderData.activeProjects },
    { label: 'In review', value: loaderData.inReview },
    { label: 'At risk', value: loaderData.atRisk },
  ]

  return (
    <Page fill>
      <Page.Header />
      <Page.Body className={styles.heroBody}>
        <Container size="lg" padX="gutter">
          <Stack gap="xl" align="center">
            <span className={styles.heroMark} aria-hidden="true">
              LE
            </span>
            <Stack gap="lg" align="center">
              <div className={styles.heroPanel}>
                <h1 className={styles.title}>Figma Make Starter</h1>
              </div>
              <Inline gap="md" justify="center" wrap="wrap">
                <Button asChild appearance="filled" intent="neutral">
                  <Link to="/projects">View projects</Link>
                </Button>
                <Button asChild appearance="filled" intent="neutral">
                  <Link to="/settings">Prototype settings</Link>
                </Button>
              </Inline>
            </Stack>
          </Stack>
        </Container>
      </Page.Body>
      <Page.Body className={styles.pageBody}>
        <Container size="xl" padX="gutter">
          <Stack gap="lg">
            <Grid minCol="sm" gap="md">
              {metrics.map((metric) => (
                <Card key={metric.label}>
                  <CardContent>
                    <Stack gap="xs">
                      <p className={styles.metricLabel}>{metric.label}</p>
                      <p className={styles.metricValue}>{metric.value}</p>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Card>
              <CardContent>
                <Stack gap="md">
                  <h2 className={styles.cardTitle}>Recently updated</h2>
                  {loaderData.recentProjects.map((project: Project) => (
                    <Inline
                      key={project.id}
                      align="start"
                      gap="md"
                      justify="between"
                      wrap="wrap"
                    >
                      <Stack gap="xs">
                        <h3 className={styles.projectName}>{project.name}</h3>
                        <p className={styles.mutedText}>{project.summary}</p>
                      </Stack>
                      <Button asChild>
                        <Link to={`/projects/${project.id}`}>Open</Link>
                      </Button>
                    </Inline>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Page.Body>
      <Page.Footer>
        <AppFooter />
      </Page.Footer>
    </Page>
  )
}
