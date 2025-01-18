import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@/components/theme-provider';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div className="full-screen bg-emerald-200 dark:bg-zinc-950 dark:text-foreground">
    <React.StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Router>
            <App />
          </Router>
        </ThemeProvider>
    </React.StrictMode>
  </div>
);