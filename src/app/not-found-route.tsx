import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router'
import { Page } from './layouts/page'

export default function NotFoundRoute() {
  return (
    <Page title="Page not found" description="This route does not exist yet.">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography>
              Add new pages by creating a feature-owned route module and wiring
              it in `src/app/routes.ts`.
            </Typography>
            <Button component={Link} to="/" variant="contained">
              Back to dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  )
}
