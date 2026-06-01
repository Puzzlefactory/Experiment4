import { createBrowserRouter, isRouteErrorResponse, Link, Outlet, useRouteError } from 'react-router'
import { Button, Container, Panel, Stack } from '@klt-ui/design-system'
import { AppFrame } from './layouts/app-frame'
import DashboardRoute, { loader as dashboardLoader } from './routes/dashboard-route'
import ProjectsIndexRoute, {
  action as projectsAction,
  loader as projectsLoader,
} from './routes/projects-index-route'
import ProjectDetailRoute, {
  loader as projectDetailLoader,
} from './routes/project-detail-route'
import SettingsRoute, { loader as settingsLoader } from './routes/settings-route'
import NotFoundRoute from './not-found-route'
import styles from './routes.module.css'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <AppRouteError />,
    children: [
      {
        index: true,
        loader: dashboardLoader,
        Component: DashboardRoute,
      },
      {
        path: 'projects',
        loader: projectsLoader,
        action: projectsAction,
        Component: ProjectsIndexRoute,
      },
      {
        path: 'projects/:projectId',
        loader: projectDetailLoader,
        Component: ProjectDetailRoute,
      },
      {
        path: 'settings',
        loader: settingsLoader,
        Component: SettingsRoute,
      },
      {
        path: '*',
        Component: NotFoundRoute,
      },
    ],
  },
])

function AppLayout() {
  return (
    <AppFrame>
      <Outlet />
    </AppFrame>
  )
}

function AppRouteError() {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const message = isRouteErrorResponse(error)
    ? typeof error.data === 'string'
      ? error.data
      : 'The route could not load with the current prototype role.'
    : error instanceof Error
      ? error.message
      : 'The application encountered an unknown error.'

  return (
    <AppFrame>
      <Container size="lg" padX="gutter">
        <Stack gap="md">
          <Panel surface="warning" pad="lg">
            <Stack gap="md">
              <h1 className={styles.errorTitle}>{title}</h1>
              <p className={styles.mutedText}>{message}</p>
            </Stack>
          </Panel>
          <Button asChild appearance="filled" intent="primary">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </Stack>
      </Container>
    </AppFrame>
  )
}
