import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './styles/index.css'
import App from './components/App.jsx'

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId = {CLIENT_ID}>
     <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
