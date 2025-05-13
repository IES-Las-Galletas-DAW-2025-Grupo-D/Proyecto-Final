import { Route, Routes } from "react-router";
import { FullLayout } from "./components/layouts/full/FullLayout";
import { HomePage } from "./Home/HomePage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";

export function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <FullLayout>
              <HomePage />
            </FullLayout>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}
