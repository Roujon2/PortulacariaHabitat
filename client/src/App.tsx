import React from 'react';
import './App.css';

import axios from 'axios';
import Login from './components/Pages/Login/Login';
import { AuthContextProvider, AuthContextProps, AuthContext } from './contexts/AuthContext';
import Callback from './components/Callback';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Pages/Home/Home';
import AuthGuard from './components/AuthGuard';

// Ensures cookies are sent
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: '/',
    element:(
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/callback', // google will redirect here
    element: <Callback />,
  },
]);

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
};

export default App;