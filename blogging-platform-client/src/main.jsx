import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, redirect} from "react-router-dom"
import AuthProvider from './contexts/AuthContext.jsx'
import Home from './home.jsx'
import About from './about.jsx'
import ProtectedRoute from './routes/ProtectedRoutes.jsx'
import Users from './users.jsx'
import Login from './login.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "/",
      element: <Home />
    },
    {
      path: "/about",
      element: <About />

    },
    {
      path: "/users",
      element: (
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      )
    },
    {
      path: "/login",
      element: <Login />
    }]
    
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
  </React.StrictMode>,
)
