import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-datepicker/dist/react-datepicker.css";
import ThemeProvider from "./utils/ThemeContext";
import App from "./App";
import Internet from "./utils/Internet.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Router>
    <ThemeProvider>
      <Internet>
        <App />
      </Internet>
    </ThemeProvider>
  </Router>
  //* </React.StrictMode> */}
);
