import { Footer } from "./Footer";
import { Header } from "./Header";

export function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-indigo-700/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-700/20 rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative">
          <Header />

          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}
