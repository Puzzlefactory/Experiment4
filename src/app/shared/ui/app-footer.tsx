import { FooterBar } from '@klt-ui/design-system'
import poweredByLogo from '@/app/assets/powered-by-logo-light.svg'
import styles from './app-footer.module.css'

export function AppFooter() {
  return (
    <FooterBar
      border
      muted
      start={
        <img
          alt="Powered by Kultera"
          className={styles.poweredByLogo}
          src={poweredByLogo}
        />
      }
      end={<span className={styles.copy}>Copyright 2026 Kultera</span>}
    />
  )
}
