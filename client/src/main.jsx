import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { EMSProvider } from './context/EMSContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EMSProvider>
        <App />
      </EMSProvider>
    </AuthProvider>
  </StrictMode>
)
