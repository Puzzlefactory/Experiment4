import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { NavLink, useRevalidator } from 'react-router'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderIcon from '@mui/icons-material/Folder'
import SettingsIcon from '@mui/icons-material/Settings'
import { LogOut, Settings, User } from 'lucide-react'
import { RoleSwitcherDialog } from '@/app/shared/auth/role-switcher-dialog'
import {
  clearPrototypeSession,
  loadPrototypeSession,
  savePrototypeSession,
} from '@/app/shared/auth/session-storage'
import type { PrototypeSession } from '@/app/shared/auth/types'

const drawerWidth = 248

const navItems = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Projects', to: '/projects', icon: <FolderIcon fontSize="small" /> },
  { label: 'Settings', to: '/settings', icon: <SettingsIcon fontSize="small" /> },
]

interface AppFrameProps {
  children: ReactNode
}

export function AppFrame({ children }: AppFrameProps) {
  const [session, setSession] = useState<PrototypeSession | null>(() =>
    loadPrototypeSession(),
  )
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const revalidator = useRevalidator()

  const userLabel = useMemo(() => {
    if (!session) {
      return 'No role selected'
    }

    return `${session.user.name} · ${session.user.role}`
  }, [session])

  function handleLogout() {
    setProfileMenuOpen(false)
    clearPrototypeSession()
    setSession(null)
    setRoleSwitcherOpen(true)
    revalidator.revalidate()
  }

  function handleSessionSelected(nextSession: PrototypeSession) {
    savePrototypeSession(nextSession)
    setSession(nextSession)
    revalidator.revalidate()
  }

  function handleOpenRoleSwitcher() {
    setProfileMenuOpen(false)
    setRoleSwitcherOpen(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3">Prototype Workspace</Typography>
            <Typography color="text.secondary" variant="body2">
              Base layout app for Figma Make extension testing
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip color={session ? 'primary' : 'default'} label={userLabel} />
            <ClickAwayListener onClickAway={() => setProfileMenuOpen(false)}>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
                  aria-expanded={profileMenuOpen ? 'true' : undefined}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                >
                  <User aria-hidden size={20} strokeWidth={2} />
                </IconButton>
                {profileMenuOpen ? (
                  <Paper
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      minWidth: 220,
                      overflow: 'hidden',
                      zIndex: (theme) => theme.zIndex.modal,
                    }}
                  >
                    <MenuList autoFocusItem id="profile-menu">
                      <MenuItem onClick={handleOpenRoleSwitcher}>
                        <ListItemIcon>
                          <User aria-hidden size={18} strokeWidth={2} />
                        </ListItemIcon>
                        Switch role
                      </MenuItem>
                      <MenuItem
                        component={NavLink}
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <ListItemIcon>
                          <Settings aria-hidden size={18} strokeWidth={2} />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogOut aria-hidden size={18} strokeWidth={2} />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Paper>
                ) : null}
              </Box>
            </ClickAwayListener>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        open
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Stack spacing={2} sx={{ height: '100%', p: 2 }}>
          <Box>
            <Typography variant="h2">Make Baseline</Typography>
            <Typography color="text.secondary" variant="body2">
              Routing, auth, API, and layout patterns are pre-wired.
            </Typography>
          </Box>
          <Divider />
          <Stack component="nav" spacing={0.5}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                startIcon={item.icon}
                to={item.to}
                sx={{
                  justifyContent: 'flex-start',
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          minHeight: '100vh',
          pb: 4,
          pt: 13,
        }}
      >
        {children}
      </Box>

      <RoleSwitcherDialog
        onSessionSelected={handleSessionSelected}
        open={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />
    </Box>
  )
}
