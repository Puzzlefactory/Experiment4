import { useState } from 'react'
import { useRevalidator } from 'react-router'
import { Button, Modal, Select, Stack } from '@klt-ui/design-system'
import { prototypeRoles } from '@/app/shared/auth/roles'
import { createSessionForRole } from '@/app/shared/auth/session-factory'
import type { PrototypeSession } from '@/app/shared/auth/types'

interface RoleSwitcherDialogProps {
  onSessionSelected: (session: PrototypeSession) => void
  open: boolean
  onClose: () => void
}

export function RoleSwitcherDialog({
  onSessionSelected,
  open,
  onClose,
}: RoleSwitcherDialogProps) {
  const revalidator = useRevalidator()
  const [role, setRole] = useState(prototypeRoles[0]?.role ?? 'admin')

  function handleLogin() {
    onSessionSelected(createSessionForRole(role))
    revalidator.revalidate()
    onClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
      size="sm"
      title="Select a prototype role"
      description="This prototype uses a role switcher instead of a real login screen. Choosing a role creates an Auth0-shaped prototype JWT and updates route loaders through the shared API boundary."
      footer={
        <Button appearance="filled" intent="primary" onClick={handleLogin}>
          Continue
        </Button>
      }
    >
      <Stack gap="md">
        <Select
          label="Role"
          value={role}
          onChange={setRole}
          options={prototypeRoles.map((definition) => ({
            label: definition.label ?? definition.role,
            value: definition.role,
          }))}
          width="full"
        />
      </Stack>
    </Modal>
  )
}
