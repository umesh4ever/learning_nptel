import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StudyroomProvider } from './features/studyroom/StudyroomProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudyroomProvider>
      <App />
    </StudyroomProvider>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const serviceWorkerUrl = new URL(`${import.meta.env.BASE_URL}sw.js`, window.location.href)
    navigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
      console.error('Could not register the offline app cache.', error)
    })
  })
}
