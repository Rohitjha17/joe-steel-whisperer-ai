
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Find the root element
const rootElement = document.getElementById("root");

// Make sure root element exists before rendering
if (!rootElement) {
  console.error("Root element not found. The application cannot start.");
} else {
  // Create a root and render the application
  try {
    createRoot(rootElement).render(<App />);
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Failed to render the application:", error);
  }
}
