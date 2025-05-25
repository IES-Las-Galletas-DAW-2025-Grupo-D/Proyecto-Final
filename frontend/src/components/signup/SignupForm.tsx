import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../providers/AuthProvider";
import { register } from "../../services/RegisterService";
import { useNavigate } from "react-router";

export function SignupForm() {
  // const navigate = useNavigate();
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [password_confirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({name, email, password, password_confirmation });
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Invalid name, email or password");
        alert("Error: " + error.message);
      } else {
        alert("Please fill in all fields");
      }
    }
  };
  return (
    <>
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Signup</h2>

          {error && (
            <div className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label">Email</span>
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label">Password Confirmation</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password again"
                className="input input-bordered w-full"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Signup"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p>
              Do you already have an account?
              <Link to="/login" className="link link-primary ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}