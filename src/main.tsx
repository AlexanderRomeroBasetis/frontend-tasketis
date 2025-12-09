import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx';

console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
)