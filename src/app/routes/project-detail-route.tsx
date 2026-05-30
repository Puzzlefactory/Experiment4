import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { Page } from '@/app/layouts/page'
import { getProject } from '@/app/features/projects/projects-api'

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
        <Button component={Link} to="/projects" variant="outlined">
          Back to projects
        </Button>
      }
    >
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Chip label={project.status} />
              <Chip label={project.health} />
            </Stack>
            <Typography>Owner: {project.owner}</Typography>
            <Typography color="text.secondary">
              Updated: {new Date(project.updatedAt).toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}
