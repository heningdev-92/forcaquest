import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Carregando...
      </div>
    );
  }

  // Se tem usuário, renderiza a tela (children). Se não, redireciona para o login.
  return user ? children : <Navigate to="/login" />;
}
