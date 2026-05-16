import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { AuthProvider } from './AuthContext.tsx'
import SignUpPage from "./componenets/SignUpPage.tsx"
import './index.css'
import App from './App.tsx'
import LoginPage from './componenets/LoginPage.tsx'
import  UserProfile  from './componenets/UserProfile.tsx'

const router =createBrowserRouter([
  {
    path:"/",
    element: <App></App>,
    children:[
      {
        index:true,
        element: <UserProfile></UserProfile>
      },
      {
        path:"/signup",
        element: <SignUpPage></SignUpPage>
      },
      {
        path:"/login",
        element: <LoginPage></LoginPage>
      }
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
