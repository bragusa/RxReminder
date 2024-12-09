import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import OuterApp from './OuterApp';
import reportWebVitals from './reportWebVitals';

// Import service worker registration
import * as serviceWorkerRegistration from './ServiceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // Uncommenting StrictMode to help with debugging during development
  // <React.StrictMode>
    <OuterApp />
  // </React.StrictMode>
);

// Register the service worker
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

