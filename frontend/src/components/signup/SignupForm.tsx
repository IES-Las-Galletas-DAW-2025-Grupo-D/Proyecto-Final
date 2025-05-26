import { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import { register } from "../../services/RegisterService";
import { useAuth } from "../../providers/AuthProvider";

export function SignupForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const error = await register({ username, email, password });

    if (error) {
      const errorMsg = Object.entries(error as unknown as object)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      console.error("Signup error:", error);
      setError(errorMsg || "An unknown error occurred");
      setIsLoading(false);
      return;
    }

    login({ username, password })
      .then(() => {
        navigate("/");
      })
      .catch((_) => {
        navigate("/login");
      });
  };
  return (
    <>
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Signup</h2>

          {error && (
            <div className="alert alert-error mt-4">
              <BiErrorCircle className="h-6 w-6" />
              <ul>
                {error.split("\n").map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  "Register"
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
