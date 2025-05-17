import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./providers/AuthProvider";
import DefaultLayout from "./layout/DefaultLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
          <DefaultLayout>
            <App/>
          </DefaultLayout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
