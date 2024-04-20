import React from 'react';
import ReactDOM from 'react-dom/client';
import "bulma/css/bulma.min.css";
import App from './App';
import Login from './components/Login';

import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <UserProvider>
    <App />
  </UserProvider>
  </>
)
