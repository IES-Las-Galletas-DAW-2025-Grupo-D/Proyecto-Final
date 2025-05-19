import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { login as loginService } from "../../services/LoginService";
import { Link, useNavigate } from "react-router";


export function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const response = await loginService({
        usernameOrEmail: username,
        password: password,
    });
      if (response?.token) {
        console.log("Login successful", response);
        login();
        if (rememberMe) {
          localStorage.setItem("token", response.token); 
          console.log("Token en localStorage:", localStorage.getItem("token"));
        } else {
          sessionStorage.setItem("token", response.token); 
          console.log("Token en sessionStorage:", sessionStorage.getItem("token"));
          
        }
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
    <div className="max-w-3xl justify-center mx-auto text-center items-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text  animate-fadeIn delay-300 mb-6"
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
            placeholder="Tu nombre o tu correo"
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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>

        <p>
          <label className="flex font-medium items-center space-x-2 mb-4 justify-center">
            <input
            className="text-center"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Recuérdame</span>
          </label>
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
