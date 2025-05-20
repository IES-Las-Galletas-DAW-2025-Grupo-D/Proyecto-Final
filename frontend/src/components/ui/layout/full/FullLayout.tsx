import { Footer } from "./Footer";
import { Header } from "./Header";

export function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b ">
        <div className="bg-base-200 py-6 px-9">
          <Header />
          <div className="place-items-center justify-center items-center min-h-screen py-14">
          {children}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}
