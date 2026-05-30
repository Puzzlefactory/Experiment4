import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { createBrowserRouter, isRouteErrorResponse, Link, Outlet, useRouteError } from 'react-router'
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
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Alert severity="warning">{title}</Alert>
          <Typography>{message}</Typography>
          <Button component={Link} to="/" variant="contained">
            Back to dashboard
          </Button>
        </Stack>
      </Box>
    </AppFrame>
  )
}
