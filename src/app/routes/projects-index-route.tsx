import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Page } from '@/app/layouts/page'
import type { Project } from '@/app/features/projects/types'
import {
  createProject,
  createProjectSchema,
  listProjects,
} from '@/app/features/projects/projects-api'

type ProjectsActionData = {
  ok: false
  errors: {
    name?: string[]
    summary?: string[]
  }
}

export async function loader() {
  return { projects: await listProjects() }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const result = createProjectSchema.safeParse({
    name: formData.get('name'),
    summary: formData.get('summary'),
  })

  if (!result.success) {
    return {
      ok: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  await createProject(result.data)
  return redirect('/projects')
}

export default function ProjectsIndexRoute() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>
  const actionData = useActionData() as ProjectsActionData | undefined
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <Page
      eyebrow="Feature slice"
      title="Projects"
      description="Projects are loaded through a route loader. The create form posts to a route action, which calls the shared API client."
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack component={Form} method="post" spacing={2} action="/projects">
              <Typography variant="h2">Create project</Typography>
              <TextField
                error={Boolean(actionData?.errors?.name)}
                helperText={actionData?.errors?.name?.[0]}
                label="Project name"
                name="name"
              />
              <TextField
                error={Boolean(actionData?.errors?.summary)}
                helperText={actionData?.errors?.summary?.[0]}
                label="Summary"
                multiline
                name="summary"
                rows={3}
              />
              <Button disabled={isSubmitting} type="submit" variant="contained">
                {isSubmitting ? 'Creating...' : 'Create project'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {loaderData.projects.map((project: Project) => (
            <Card key={project.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="h2">{project.name}</Typography>
                      <Typography color="text.secondary">
                        {project.summary}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Chip label={project.status} />
                      <Chip color={healthColor(project.health)} label={project.health} />
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Typography color="text.secondary">
                      Owner: {project.owner}
                    </Typography>
                    <Button component={Link} to={`/projects/${project.id}`}>
                      Open detail
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Page>
  )
}

function healthColor(health: string): 'success' | 'warning' | 'error' {
  if (health === 'at-risk') {
    return 'error'
  }

  if (health === 'watch') {
    return 'warning'
  }

  return 'success'
}
