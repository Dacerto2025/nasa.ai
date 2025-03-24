import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Garantir que o elemento root existe
const rootElement = document.getElementById("root");
if (!rootElement) {
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
