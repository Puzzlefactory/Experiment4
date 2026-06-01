import type { ReactNode } from 'react'
import { Container, Inline, Page as KulteraPage, Stack } from '@klt-ui/design-system'
import styles from './page.module.css'

interface PageProps {
  title: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function Page({
  title,
  eyebrow,
  description,
  actions,
  children,
}: PageProps) {
  return (
    <KulteraPage>
      <KulteraPage.Body>
        <Container size="xl" padX="gutter">
          <Stack gap="lg">
            <Inline align="start" justify="between" gap="md">
              <Stack gap="xs">
                {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h1 className={styles.title}>{title}</h1>
                {description ? <p className={styles.description}>{description}</p> : null}
              </Stack>
              {actions ? <div className={styles.actions}>{actions}</div> : null}
            </Inline>
            {children}
          </Stack>
        </Container>
      </KulteraPage.Body>
    </KulteraPage>
  )
}
