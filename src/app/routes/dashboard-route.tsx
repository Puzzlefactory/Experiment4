import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useLoaderData } from 'react-router'
import Button from '@mui/material/Button'
import { Page } from '@/app/layouts/page'
import { prototypeApi } from '@/app/shared/api/prototype-api'
import type { DashboardResponse } from '@/app/shared/backend/fake-backend'
import type { Project } from '@/app/features/projects/types'

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
        <Button component={Link} to="/projects" variant="contained">
          View projects
        </Button>
      }
    >
      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{metric.label}</Typography>
                <Typography variant="h1">{metric.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h2">Recently updated</Typography>
            {loaderData.recentProjects.map((project: Project) => (
              <Stack
                key={project.id}
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                sx={{ justifyContent: 'space-between' }}
              >
                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 700 }}>{project.name}</Typography>
                  <Typography color="text.secondary">{project.summary}</Typography>
                </Stack>
                <Button component={Link} to={`/projects/${project.id}`}>
                  Open
                </Button>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}
