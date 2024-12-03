import React from 'react';
import './App.css';

import axios from 'axios';
import Login from './components/Pages/Login/Login';
import { AuthContextProvider } from './contexts/AuthContext';
import Callback from './components/Callback';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthGuard from './components/AuthGuard';
import MainWrapper from './components/Pages/MainWrapper/MainWrapper';

// Ensures cookies are sent
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        {/* Wrap all routes with the main wrapper */}
        <MainWrapper /> 
      </AuthGuard>
    )
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