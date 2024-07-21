import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';
import { useContext } from 'react';
import Login from './components/Login';
import { AuthContextProvider, AuthContextProps, AuthContext } from './contexts/AuthContext';
import Callback from './components/Callback';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Ensures cookies are sent
axios.defaults.withCredentials = true;

const Home = () => {
  const { loggedIn } = useContext(AuthContext) as AuthContextProps;
  if (loggedIn === true) return <p><p>Logged In!</p></p>
  if (loggedIn === false) return <Login />
  return <p>Error... Connection to server failed</p>
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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