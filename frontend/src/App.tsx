import {
  Route,
  Routes
} from "react-router";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";

export function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
