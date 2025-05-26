import { Route, Routes } from "react-router";
import { FullLayout } from "./components/ui/layout/full/FullLayout";
import { FullLayout } from "./components/ui/layout/full/FullLayout";
import { HomePage } from "./Home/HomePage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ProjectsListPage } from "./pages/projects/ProjectsListPage";
import { DashboardLayout } from "./components/ui/layout/dashboard/DashboardLayout";
import { ProjectPage } from "./pages/projects/ProjectPage";
import { SignupPage } from "./pages/signup/SignupPage";
import { LoginPage } from "./pages/login/LoginPage";
import { NotFoundErrorPage } from "./pages/errors/NotFoundErrorPage";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import { PublicOnlyRoute } from "./components/routes/PublicOnlyRoute";
import { PaymentConfirmationPage } from "./pages/payment/PaymentConfirmationPage";
import { UpgradePage } from "./pages/upgrade/UpgradePage";

export function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route
            path="/"
            element={
              <FullLayout>
                <HomePage />
              </FullLayout>
            }
          />

          <Route element={<PublicOnlyRoute />}>
            
              <Route path="/signup" element={
                <FullLayout>
                <SignupPage />
                </FullLayout>
              } 
              />
              <Route path="/login" element={
                <FullLayout>
                <LoginPage />
                </FullLayout>
              } />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="plans" element={<UpgradePage />}></Route>
            <Route path="/payment/confirmation" element={<PaymentConfirmationPage />} />
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects">
                <Route index element={<ProjectsListPage />} />
                <Route path=":projectId" element={<ProjectPage />} />
              </Route>
              <Route path="tasks" element={<DashboardPage />} />
              <Route path="settings" element={<DashboardPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundErrorPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
