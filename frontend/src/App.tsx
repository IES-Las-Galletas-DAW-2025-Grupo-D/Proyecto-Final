import { Route, Routes } from "react-router";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import { PublicOnlyRoute } from "./components/routes/PublicOnlyRoute";
import { DashboardLayout } from "./components/ui/layout/dashboard/DashboardLayout";
import { FullLayout } from "./components/ui/layout/full/FullLayout";
import { HomePage } from "./Home/HomePage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { NotFoundErrorPage } from "./pages/errors/NotFoundErrorPage";
import { LoginPage } from "./pages/login/LoginPage";
import { NotificationsFeedPage } from "./pages/notifications/NotificationsFeedPage";
import { PaymentConfirmationPage } from "./pages/payment/PaymentConfirmationPage";
import { ProjectPage } from "./pages/projects/ProjectPage";
import { ProjectsListPage } from "./pages/projects/ProjectsListPage";
import { SignupPage } from "./pages/signup/SignupPage";
import { UpgradePage } from "./pages/upgrade/UpgradePage";
import { AuthProvider } from "./providers/AuthProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

export function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
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
              <Route
                path="/signup"
                element={
                  <FullLayout>
                    <SignupPage />
                  </FullLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <FullLayout>
                    <LoginPage />
                  </FullLayout>
                }
              />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="plans" element={<UpgradePage />}></Route>
              <Route
                path="/payment/confirmation"
                element={<PaymentConfirmationPage />}
              />
              <Route
                path="dashboard"
                element={
                  <NotificationProvider>
                    <DashboardLayout />
                  </NotificationProvider>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="projects">
                  <Route index element={<ProjectsListPage />} />
                  <Route path=":projectId" element={<ProjectPage />} />
                </Route>
                {/* <Route path="tasks" element={<DashboardPage />} /> */}
                <Route
                  path="notifications"
                  element={<NotificationsFeedPage />}
                />
                {/* <Route path="settings" element={<DashboardPage />} /> */}
              </Route>
            </Route>

            <Route path="*" element={<NotFoundErrorPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
