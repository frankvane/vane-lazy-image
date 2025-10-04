import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

export * from "./components/LazyLoadImagePlugin";
export * from "./components/LazyLoadImagePlugin/plugins";
export * from "./components/LazyLoadImagePlugin/custom-plugins";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
