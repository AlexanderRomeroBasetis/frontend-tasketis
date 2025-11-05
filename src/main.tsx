import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx';

const GOOGLE_CLIENT_ID = '535067351908-1ublj3kbsojh7111s33vvj26nem7toha.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
)