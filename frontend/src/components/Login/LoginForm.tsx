import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { login as loginService } from "../../services/LoginService";
import { Link, useNavigate } from "react-router";


export function LoginForm() {
  const { login } = useAuth();
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const response = await loginService({
        usernameOrEmail: username,
        password: password,
    });
      if (response) {
        console.log("Login successful", response);
        localStorage.setItem("token", response.token);
        login();
        navigate("/dashboard");
      } else {
        console.error("Login failed");
      }
    } else {
      console.error("Input fields not found");
      return;
    }
  };
  return (
    <>
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h1 className="bg-white text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent animate-fadeIn delay-300 mb-6"
      style={{ backgroundClip: "text" }}>
        Login
      </h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="EmailOrUsername" className="italic font-medium">Nombre o Email</label>
        <p>
          <input
            type="text"
            id="EmailOrUsername"
            name="EmailOrUsername"
            className="border rounded-md p-2 mb-4"
            placeholder="Dime tu nombre o tu email "
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
            className="border rounded-md p-2 mb-4"
            placeholder="Dime tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>

        <button className="px-6 py-3 border  rounded-lg font-medium transition-all duration-200 inline-flex items-center">Entrar</button>
        <p>¿No tienes cuenta?</p>
        <p>
          <Link to="/signup" className="text-xl font-semibold">Signup</Link>
        </p>
      </form>
    </div>
    </>
  );
}
