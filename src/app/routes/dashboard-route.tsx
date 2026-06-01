import { Link, useLoaderData } from 'react-router'
import { Button, Card, CardContent, Grid, Inline, Stack } from '@klt-ui/design-system'
import { Page } from '@/app/layouts/page'
import { prototypeApi } from '@/app/shared/api/prototype-api'
import type { DashboardResponse } from '@/app/shared/backend/fake-backend'
import type { Project } from '@/app/features/projects/types'
import styles from '@/app/routes.module.css'

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
    <Page
      eyebrow="Workspace"
      title="Dashboard"
      description="This page demonstrates route-level data loading through the shared API boundary."
      actions={
        <Button asChild appearance="filled" intent="primary">
          <Link to="/projects">View projects</Link>
        </Button>
      }
    >
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
    </Page>
  )
}
