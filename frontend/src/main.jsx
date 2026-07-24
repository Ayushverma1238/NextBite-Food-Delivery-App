import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/AppRoutes";
import './index.css';
import App from './App.jsx';
import WishlistProvider from "./context/WishlistContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { store } from './app/store.js';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <WishlistProvider>
        <>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="colored"
          />
        </>
    </WishlistProvider>
  </Provider>,
);
