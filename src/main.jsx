// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import './index.css';
import { store } from './components/store/store';
import ScrollToTop from './components/pages/Scrolltotop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);