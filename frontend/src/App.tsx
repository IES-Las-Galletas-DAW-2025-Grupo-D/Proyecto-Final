import { Route, Routes } from "react-router";
import { HomePage } from "./Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";

export function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
  );
}
