import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router";
  // import { useNavigate } from "react-router";

export function DashboardBody() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");  
      // Redirige al login
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <button onClick={handleLogout}>Volver al Login</button>
    </div>
  );
} 