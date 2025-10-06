import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {ToastContainer} from 'react-toastify'
import "./index.css";
import App from "./App.jsx";

// Import Poppins font weights
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
console.log("🔑 API Base URL:", import.meta.env.VITE_API_BASE_URL);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      
      <App />
      <ToastContainer position='top-right' autoClose={1500} closeOnClick/>
    </Provider>
  </StrictMode>
);
