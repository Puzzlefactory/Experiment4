import { useLoaderData } from 'react-router'
import { Badge, Card, CardContent, Stack } from '@klt-ui/design-system'
import { Page } from '@/app/layouts/page'
import { loadPrototypeSession } from '@/app/shared/auth/session-storage'
import { prototypeRolePolicy } from '@/app/shared/auth/policy'
import { prototypePermissions, prototypeRoles } from '@/app/shared/auth/roles'
import type { PrototypeRoleDefinition } from '@/app/shared/auth/types'
import styles from '@/app/routes.module.css'

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
      <Stack gap="md">
        <Badge variant="info">
          Current role: {loaderData.session?.user.role ?? 'none selected'}
        </Badge>
        {loaderData.roles.map((role: PrototypeRoleDefinition) => (
          <Card key={role.role}>
            <CardContent>
              <Stack gap="sm">
                <h2 className={styles.cardTitle}>{role.label ?? role.role}</h2>
                <p className={styles.mutedText}>{role.description}</p>
                <p className={styles.metaText}>
                  Permissions: {role.permissions.join(', ')}
                </p>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Page>
  )
}
