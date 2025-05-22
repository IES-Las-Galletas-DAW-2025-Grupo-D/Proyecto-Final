import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../providers/AuthProvider";

export function LoginForm() {
  const { login } = useAuth();
  const [usernameOrEmail, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (usernameOrEmail && password) {
      setIsLoading(true);
      try {
        await login({
          usernameOrEmail,
          password,
        });
      } catch (err) {
        setError("Invalid username/email or password");
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl ">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Login</h2>

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

          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label">Username or Email</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username or email"
                className="input input-bordered w-full"
                value={usernameOrEmail}
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

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p>
              Don't have an account?
              <Link to="/signup" className="link link-primary ml-1">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}
