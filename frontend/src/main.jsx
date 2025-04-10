import { StrictMode } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import Button from "./components/Button.jsx";

/*
 * Wait for the Dom to be loaded before trying to create the root for
 * the react app
 * */
document.addEventListener("DOMContentLoaded", () => {
  const entryPoint = document.getElementById("react-root");
  if (entryPoint) {
    const root = ReactDOM.createRoot(entryPoint);
    if (!root) {
      console.error("Root for React not found");
      return;
    }

    root.render(
      <StrictMode>
        <Button text="Click me" />
      </StrictMode>,
    );
  } else {
    console.error("DOMContent not loaded :(");
  }
});
