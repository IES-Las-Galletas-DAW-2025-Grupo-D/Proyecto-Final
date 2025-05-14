import { Link } from "react-router";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
    <header className="flex justify-between items-center mb-16">
      <div className="animate-fadeIn">
        <h2 className="text-xl font-semibold tracking-tight text-indigo-400">
          IES-Las-Galletas-DAW-2025-Grupo-D
        </h2>
      </div>
      <div>
          <ul>
            <li>
              <Link to="/login" className="text-xl font-semibold tracking-tight text-indigo-400">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="text-xl font-semibold tracking-tight text-indigo-400">Signup</Link>
            </li>
          </ul>
      </div>
      <div className="animate-fadeIn delay-200">
        <div className="px-4 py-2 border border-indigo-500/30 rounded-md bg-indigo-500/10 text-indigo-300 inline-flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse-slow"></span>
          Frontend Online
        </div>
      </div>
    </header>

    <main>{children}</main>
    </>
  );
}