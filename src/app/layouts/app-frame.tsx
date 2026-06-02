import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { NavLink, useMatch, useNavigate, useRevalidator } from 'react-router'
import {
  AppFrame as KulteraAppFrame,
  useAppFrameOverlayRoot,
} from '@klt-ui/composition'
import {
  Badge,
  Button,
  DropdownMenu,
  HeaderBar,
  Inline,
  ModalManagerProvider,
  NavLinks,
  type DropdownMenuItemData,
  type NavLinksLinkComponentProps,
} from '@klt-ui/design-system'
import { LogOut, Settings, User } from 'lucide-react'
import { RoleSwitcherDialog } from '@/app/shared/auth/role-switcher-dialog'
import {
  clearPrototypeSession,
  loadPrototypeSession,
  savePrototypeSession,
} from '@/app/shared/auth/session-storage'
import type { PrototypeSession } from '@/app/shared/auth/types'
import styles from './app-frame.module.css'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Settings', href: '/settings' },
]

const accountItems: DropdownMenuItemData[] = [
  { value: 'switch-role', label: 'Switch role', icon: <User size={16} aria-hidden="true" /> },
  { value: 'settings', label: 'Settings', icon: <Settings size={16} aria-hidden="true" /> },
  { type: 'separator' },
  { value: 'logout', label: 'Logout', icon: <LogOut size={16} aria-hidden="true" /> },
]

interface AppFrameProps {
  children: ReactNode
}

export function AppFrame({ children }: AppFrameProps) {
  const [session, setSession] = useState<PrototypeSession | null>(() =>
    loadPrototypeSession(),
  )
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const userLabel = useMemo(() => {
    if (!session) {
      return 'No role selected'
    }

    return `${session.user.name} · ${session.user.role}`
  }, [session])

  function handleAccountAction(value: string) {
    if (value === 'switch-role') {
      window.setTimeout(() => setRoleSwitcherOpen(true), 0)
      return
    }

    if (value === 'settings') {
      window.setTimeout(() => void navigate('/settings'), 0)
      return
    }

    if (value === 'logout') {
      clearPrototypeSession()
      setSession(null)
      window.setTimeout(() => {
        setRoleSwitcherOpen(true)
        revalidator.revalidate()
      }, 0)
    }
  }

  function handleSessionSelected(nextSession: PrototypeSession) {
    savePrototypeSession(nextSession)
    setSession(nextSession)
  }

  return (
    <ModalManagerProvider>
      <KulteraAppFrame
        brand="le"
        theme="light"
        density="cozy"
        defaultBrand="le"
        defaultTheme="light"
        defaultDensity="cozy"
        persistPreference={false}
        layout="header-main"
        header={
          <HeaderBar
            brand={<Branding />}
            navigation={
              <NavLinks
                ariaLabel="Primary navigation"
                links={navLinks}
                linkComponent={HeaderNavLink}
              />
            }
            actions={
              <AccountActions
                isSignedIn={session !== null}
                userLabel={userLabel}
                onAction={handleAccountAction}
              />
            }
          />
        }
      >
        {children}
        <RoleSwitcherDialog
          onSessionSelected={handleSessionSelected}
          open={roleSwitcherOpen}
          onClose={() => setRoleSwitcherOpen(false)}
        />
      </KulteraAppFrame>
    </ModalManagerProvider>
  )
}

function AccountActions({
  isSignedIn,
  userLabel,
  onAction,
}: {
  isSignedIn: boolean
  userLabel: string
  onAction: (value: string) => void
}) {
  const overlayRoot = useAppFrameOverlayRoot()

  return (
    <Inline align="center" gap="sm" wrap="nowrap">
      <Badge variant={isSignedIn ? 'primary' : 'neutral'}>{userLabel}</Badge>
      <DropdownMenu
        align="end"
        items={accountItems}
        onAction={onAction}
        portalContainer={overlayRoot ?? undefined}
        trigger={
          <Button
            appearance="ghost"
            aria-label="Open profile menu"
            shape="round"
            size="icon"
          >
            <User size={18} aria-hidden="true" />
          </Button>
        }
      />
    </Inline>
  )
}

function HeaderNavLink({ href, label, className }: NavLinksLinkComponentProps) {
  const to = href ?? '/'
  const end = to === '/'
  const isCurrent = useMatch({ path: to, end }) !== null

  return (
    <NavLink
      to={to}
      end={end}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
      data-current={isCurrent ? 'true' : undefined}
    >
      {label}
    </NavLink>
  )
}

function Branding() {
  return (
    <Inline align="center" gap="sm" wrap="nowrap">
      <span className={styles.brandMark} aria-hidden="true">
        LE
      </span>
      <span className={styles.brandText}>Prototype Starter</span>
    </Inline>
  )
}
