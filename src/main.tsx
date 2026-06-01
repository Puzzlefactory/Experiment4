import { createRoot } from 'react-dom/client'
import App from './app/App'
import '@klt-ui/design-system/styles.css'
import '@klt-ui/design-system/tokens/css/kultera-light.css'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(<App />)
