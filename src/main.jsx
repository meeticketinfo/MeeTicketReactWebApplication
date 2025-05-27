import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
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
