import { Route, Routes } from "react-router";
import { FullLayout } from "./components/ui/layout/full/FullLayout";
import { HomePage } from "./Home/HomePage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ProjectsListPage } from "./pages/Projects/ProjectsListPage";
import { DashboardLayout } from "./components/ui/layout/dashboard/DashboardLayout";
import { ProjectPage } from "./pages/Projects/ProjectPage";

export function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route
            index
            element={
              <FullLayout>
                <HomePage />
              </FullLayout>
            }
          />

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects">
              <Route index element={<ProjectsListPage />} />
              <Route path=":projectId" element={<ProjectPage />} />
            </Route>
            <Route path="tasks" element={<DashboardPage />} />
            <Route path="settings" element={<DashboardPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}
