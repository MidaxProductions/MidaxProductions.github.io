import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NeedsPseudoGlass } from './Device'

// pseudo glass treatment for iOS / Firefox / Safari, before first paint so the plain fallback never flashes
if (NeedsPseudoGlass()) document.documentElement.classList.add('pseudo-glass')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
