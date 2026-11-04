import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { forwardErrorsToLog } from "./logging";
import "./styles.css";
import "./materials.css";

forwardErrorsToLog();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
