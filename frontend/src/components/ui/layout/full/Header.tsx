import { Link } from "react-router";

export function Header() {

  return (
    <header className="flex justify-between items-center mb-16 py-10">
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="navbar-start">
              <Link to="/" className="btn btn-ghost text-xl">TimeWeaver</Link>
            </div>
            <div className="navbar-end px-4">
              <Link to="/dashboard" className="btn bg-primary text-primary-content text-base">Dashboard</Link>
            </div>
        </div>
      </nav>
    </header>
  );
}
