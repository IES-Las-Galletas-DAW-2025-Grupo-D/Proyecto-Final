import { Link } from "react-router";

export function Header() {

  return (
    <header className="flex justify-between items-center mb-16">
      <div className="navbar bg-base-100 ">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">TimeLines</Link>
        </div>
        <div className="navbar-end px-4">
          <Link to="/signup" className="btn bg-primary text-primary-content text-base">Signup</Link>
        </div>
    </div>
    </header>
  );
}
