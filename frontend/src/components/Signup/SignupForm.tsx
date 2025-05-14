import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Navigate } from "react-router";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h1 className="bg-gradient text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent animate-fadeIn delay-300 mb-6"
      style={{ backgroundClip: "text" }}>
        SignUp
      </h1>
      <form action="">
        <label htmlFor="EmailOrUsername" className="italic font-medium">Nombre</label>
        <p>
          <input
            type="text"
            id="EmailOrUsername"
            name="EmailOrUsername"
            className="border border-gray-300 rounded-md p-2 mb-4"
            placeholder="Dime tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </p>

        <label htmlFor="password" className="italic font-medium">Contraseña</label>
        <p>
          <input
            type="password"
            id="password"
            name="password"
            className="border border-gray-300 rounded-md p-2 mb-4"
            placeholder="Dime tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>

        <button className="px-6 py-3 border border-indigo-500/30 hover:bg-indigo-500/10 rounded-lg font-medium transition-all duration-200 inline-flex items-center">Login</button>
      </form>
    </div>
    </>
  );
}