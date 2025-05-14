import {
  Route,
  Routes
} from "react-router";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { AuthProvider } from "./providers/AuthProvider";

export function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <RouterProvider router={login} /> */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<AuthProvider />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
