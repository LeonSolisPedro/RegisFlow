import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./views/register"
import Login from "./views/login"
import Index, {loader} from "./views/index"
import "./axios"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    loader: loader
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  }
]);

//Bootstrap
import "./customStyle.scss"


//Sweetalert
import "./sweetalert"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
