import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useLoaderData } from 'react-router'
import { Page } from '@/app/layouts/page'
import { loadPrototypeSession } from '@/app/shared/auth/session-storage'
import { prototypeRolePolicy } from '@/app/shared/auth/policy'
import { prototypePermissions, prototypeRoles } from '@/app/shared/auth/roles'
import type { PrototypeRoleDefinition } from '@/app/shared/auth/types'

export async function loader() {
  const session = loadPrototypeSession()
  prototypeRolePolicy.requirePermission(session, prototypePermissions.viewSettings)
  return {
    session,
    roles: prototypeRoles,
  }
}

export default function SettingsRoute() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>

  return (
    <Page
      eyebrow="Prototype controls"
      title="Settings"
      description="This route demonstrates permission-gated access through the shared role policy."
    >
      <Stack spacing={2}>
        <Alert severity="info">
          Current role: {loaderData.session?.user.role ?? 'none selected'}
        </Alert>
        {loaderData.roles.map((role: PrototypeRoleDefinition) => (
          <Card key={role.role}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h2">{role.label ?? role.role}</Typography>
                <Typography color="text.secondary">{role.description}</Typography>
                <Typography variant="body2">
                  Permissions: {role.permissions.join(', ')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Page>
  )
}
