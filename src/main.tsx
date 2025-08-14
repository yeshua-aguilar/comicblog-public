import { Buffer } from 'buffer'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.tsx'

// Make Buffer available globally
(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer

createRoot(document.getElementById('root')!).render(
    <App />
)
