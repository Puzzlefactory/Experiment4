import { useState } from 'react'
import { useRevalidator } from 'react-router'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle>Select a prototype role</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography color="text.secondary">
            This prototype uses a role switcher instead of a real login screen.
            Choosing a role creates an Auth0-shaped prototype JWT and updates
            route loaders through the shared API boundary.
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="prototype-role-label">Role</InputLabel>
            <Select
              label="Role"
              labelId="prototype-role-label"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {prototypeRoles.map((definition) => (
                <MenuItem key={definition.role} value={definition.role}>
                  {definition.label ?? definition.role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleLogin}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}
