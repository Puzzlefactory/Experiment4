import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { NavLink, useRevalidator } from 'react-router'
import { Badge, Button, Inline, Separator, Stack } from '@klt-ui/design-system'
import { Folder, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { RoleSwitcherDialog } from '@/app/shared/auth/role-switcher-dialog'
import {
  clearPrototypeSession,
  loadPrototypeSession,
  savePrototypeSession,
} from '@/app/shared/auth/session-storage'
import type { PrototypeSession } from '@/app/shared/auth/types'
import styles from './app-frame.module.css'

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: Folder },
  { label: 'Settings', to: '/settings', icon: Settings },
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
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Stack gap="lg">
          <Stack gap="xs">
            <h1 className={styles.brand}>Make Baseline</h1>
            <p className={styles.sidebarText}>
              Routing, auth, API, and layout patterns are pre-wired.
            </p>
          </Stack>
          <Separator />
          <nav className={styles.nav} aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  <Icon aria-hidden size={18} strokeWidth={2} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </Stack>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.header}>
          <Stack gap="0">
            <h2 className={styles.headerTitle}>Prototype Workspace</h2>
            <p className={styles.headerText}>
              Base layout app for Figma Make extension testing
            </p>
          </Stack>

          <Inline gap="sm" align="center" wrap="nowrap">
            <Badge variant={session ? 'primary' : 'neutral'}>{userLabel}</Badge>
            <div className={styles.profileMenuRoot}>
              <Button
                aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
                aria-expanded={profileMenuOpen ? 'true' : undefined}
                aria-haspopup="menu"
                aria-label="Open profile menu"
                appearance="ghost"
                size="icon"
                shape="round"
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <User aria-hidden size={18} strokeWidth={2} />
              </Button>

              {profileMenuOpen ? (
                <div className={styles.profileMenu} id="profile-menu" role="menu">
                  <button type="button" className={styles.menuItem} onClick={handleOpenRoleSwitcher}>
                    <User aria-hidden size={17} strokeWidth={2} />
                    Switch role
                  </button>
                  <NavLink
                    className={styles.menuItem}
                    role="menuitem"
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings aria-hidden size={17} strokeWidth={2} />
                    Settings
                  </NavLink>
                  <Separator />
                  <button type="button" className={styles.menuItem} onClick={handleLogout}>
                    <LogOut aria-hidden size={17} strokeWidth={2} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </Inline>
        </header>

        <main className={styles.main}>{children}</main>
      </div>

      <RoleSwitcherDialog
        onSessionSelected={handleSessionSelected}
        open={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />
    </div>
  )
}
