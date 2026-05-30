import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

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
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {eyebrow ? (
              <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
                {eyebrow}
              </Typography>
            ) : null}
            <Typography variant="h1">{title}</Typography>
            {description ? (
              <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {actions ? <Box>{actions}</Box> : null}
        </Stack>
        {children}
      </Stack>
    </Container>
  )
}
