import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 开发环境下的错误捕获
if (import.meta.env.DEV) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('React does not recognize the') || 
        args[0]?.includes?.('Invalid prop')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
