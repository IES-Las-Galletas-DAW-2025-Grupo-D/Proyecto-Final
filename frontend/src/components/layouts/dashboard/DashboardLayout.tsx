import { Header } from "./Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      <Header />

      <div className="flex-1 overflow-auto p-6">
        <main className="container mx-auto">{children}</main>
      </div>
    </div>
  );
}
