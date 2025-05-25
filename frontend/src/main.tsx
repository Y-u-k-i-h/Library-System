import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.log("Root element not found");
} else {
    const root = createRoot(rootElement);
    root.render (
        <StrictMode>
            <App />
        </StrictMode>
    );
}
