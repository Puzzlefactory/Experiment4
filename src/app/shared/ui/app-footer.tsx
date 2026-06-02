import { FooterBar } from '@klt-ui/design-system'
import styles from './app-footer.module.css'

export function AppFooter() {
  return (
    <FooterBar
      border
      muted
      start={
        <span className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            LE
          </span>
          <span>Powered by Kultera</span>
        </span>
      }
      end={<span className={styles.copy}>Copyright 2026 Kultera</span>}
    />
  )
}
