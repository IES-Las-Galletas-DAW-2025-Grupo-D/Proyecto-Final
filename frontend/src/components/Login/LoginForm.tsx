export function LoginForm() {
  return (
    <>
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h1 className="bg-gradient text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent animate-fadeIn delay-300 mb-6"
      style={{ backgroundClip: "text" }}>
        Login
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
          />
        </p>

        <button className="px-6 py-3 border border-indigo-500/30 hover:bg-indigo-500/10 rounded-lg font-medium transition-all duration-200 inline-flex items-center">Login</button>
      </form>
    </div>
    </>
  );
}


import { LoginRequest } from "../../types/user.types";
import { login as loginService } from "../../services/LoginService";
// src/components/Login/LoginForm.tsx


export async function login() {
  const inputEmailOrUsername = document.getElementById("EmailOrUsername") as HTMLInputElement;
  const inputPassword = document.getElementById("password") as HTMLInputElement;
  const request: LoginRequest = {
    usernameOrEmail: "",
    password: "",
  };

  if (inputEmailOrUsername && inputPassword) {
    request.usernameOrEmail = inputEmailOrUsername.value;
    request.password = inputPassword.value;
  } else {
    console.error("Input fields not found");
    return;
  }

  const response = await loginService(request);
  if (response) {
    console.log("Login successful", response);
  } else {
    console.error("Login failed");
  }
}