import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Divider,
  Inline,
  Input,
  Stack,
} from '@klt-ui/design-system'
import { Page } from '@/app/layouts/page'
import type { Project } from '@/app/features/projects/types'
import {
  createProject,
  createProjectSchema,
  listProjects,
} from '@/app/features/projects/projects-api'
import styles from '@/app/routes.module.css'

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
      <Stack gap="lg">
        <Card>
          <CardContent>
            <Form method="post" action="/projects" className={styles.form}>
              <Stack gap="md">
                <h2 className={styles.cardTitle}>Create project</h2>
                <div className={styles.fieldStack}>
                  <label className={styles.label} htmlFor="project-name">
                    Project name
                  </label>
                  <Input
                    id="project-name"
                    name="name"
                    validationState={actionData?.errors?.name ? 'error' : 'none'}
                    width="full"
                  />
                  {actionData?.errors?.name?.[0] ? (
                    <p className={styles.fieldError}>{actionData.errors.name[0]}</p>
                  ) : null}
                </div>
                <div className={styles.fieldStack}>
                  <label className={styles.label} htmlFor="project-summary">
                    Summary
                  </label>
                  <textarea
                    className={styles.textarea}
                    id="project-summary"
                    name="summary"
                  />
                  {actionData?.errors?.summary?.[0] ? (
                    <p className={styles.fieldError}>{actionData.errors.summary[0]}</p>
                  ) : null}
                </div>
                <Button
                  appearance="filled"
                  disabled={isSubmitting}
                  intent="primary"
                  type="submit"
                >
                  {isSubmitting ? 'Creating...' : 'Create project'}
                </Button>
              </Stack>
            </Form>
          </CardContent>
        </Card>

        <Stack gap="md">
          {loaderData.projects.map((project: Project) => (
            <Card key={project.id}>
              <CardContent>
                <Stack gap="md">
                  <Inline align="start" gap="md" justify="between">
                    <Stack gap="xs">
                      <h2 className={styles.projectName}>{project.name}</h2>
                      <p className={styles.mutedText}>{project.summary}</p>
                    </Stack>
                    <Inline gap="xs" wrap="wrap">
                      <Badge>{project.status}</Badge>
                      <Badge variant={healthVariant(project.health)}>{project.health}</Badge>
                    </Inline>
                  </Inline>
                  <Divider />
                  <Inline gap="md" justify="between">
                    <p className={styles.metaText}>Owner: {project.owner}</p>
                    <Button asChild>
                      <Link to={`/projects/${project.id}`}>Open detail</Link>
                    </Button>
                  </Inline>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Page>
  )
}

function healthVariant(health: string): 'success' | 'warning' | 'danger' {
  if (health === 'at-risk') {
    return 'danger'
  }

  if (health === 'watch') {
    return 'warning'
  }

  return 'success'
}
