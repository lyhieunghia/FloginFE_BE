import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.js';


import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Bọc <App> */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
