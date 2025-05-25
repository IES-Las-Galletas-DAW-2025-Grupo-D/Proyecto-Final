import { Header } from "./Header";
import { Footer } from "./Footer"

export function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b ">
        <div className="bg-base-200 py-6 px-9">
          <Header />
          <div className="place-items-center justify-center items-center min-h-screen">
          {children}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
