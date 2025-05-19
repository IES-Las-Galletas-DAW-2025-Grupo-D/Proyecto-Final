import { useState } from "react";
import { Link } from "react-router";
import { register } from "../../services/RegisterService";
import { useNavigate } from "react-router";

export function SignupForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("Ocurrió un error desconocido");
      }
    }
  };
  return (
    <>
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h1 className="bg-white text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent animate-fadeIn delay-300 mb-6"
      style={{ backgroundClip: "text" }}>
        Regístrate
      </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="EmailOrUsername" className="italic font-medium">Correo Electronico</label>
        <p>
          <input
            type="text"
            id="EmailOrUsername"
            name="EmailOrUsername"
            className="border border-gray-300 rounded-md p-2 mb-4"
            placeholder="Dime tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </p>


        <label htmlFor="EmailOrUsername" className="italic font-medium">Nombre</label>
        <p>
          <input
            type="text"
            id="EmailOrUsername"
            name="EmailOrUsername"
            className="border border-gray-300 rounded-md p-2 mb-4"
            placeholder="Dime tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <button className="px-6 py-3 border rounded-lg font-medium transition-all duration-200 inline-flex items-center">Signup</button>
        <p>¿Ya tienes cuenta?</p>
        <p>
          <Link to="/login" className="text-xl font-semibold">Entrar</Link>
        </p>
      </form>
    </div>
    </>
  );
}