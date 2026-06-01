import { RouterProvider } from 'react-router/dom'
import { ThemeProvider } from '@klt-ui/design-system'
import { router } from './routes'

export default function App() {
  return (
    <ThemeProvider brand="kultera" theme="light" density="cozy" motion="on">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
