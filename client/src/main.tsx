import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const redirectPath = sessionStorage.getItem("gh-pages-spa-redirect");

if (redirectPath !== null) {
  sessionStorage.removeItem("gh-pages-spa-redirect");

  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;

  window.history.replaceState(null, "", `${baseUrl}${redirectPath}`);
}

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
