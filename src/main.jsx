import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ required toast CSS

import { router } from "./router/router.jsx";
import AuthProvider from "./Auth/AuthProvider.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);




// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'

// import { RouterProvider } from 'react-router'

// import { ToastContainer } from 'react-toastify'

// import { router } from './router/router.jsx'
// import AuthProvider from './Auth/AuthProvider.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//    <AuthProvider>
//        <RouterProvider router ={router}></RouterProvider>
//     <ToastContainer></ToastContainer>
//    </AuthProvider>
//   </StrictMode>,
// )
