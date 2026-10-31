import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";
import { useContext } from "react";
import { PrivateRoute } from "./routes/PrivateRoute";
import { GlobalStyle } from "./styles/GlobalStyle";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Lobby } from "./pages/Lobby";
import { Game } from "./pages/Game";
import { SetupGame } from "./pages/SetupGame";
import { Admin } from "./pages/Admin";

// Componente Wrapper para injetar a imagem no CSS Global
function ThemeWrapper({ children }) {
  const { currentBackground } = useContext(ThemeContext);
  return (
    <>
      <GlobalStyle $bgImage={currentBackground} />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemeWrapper>
          <BrowserRouter>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rotas Privadas */}
              <Route
                path="/lobby"
                element={
                  <PrivateRoute>
                    <Lobby />
                  </PrivateRoute>
                }
              />
              <Route
                path="/setup"
                element={
                  <PrivateRoute>
                    <SetupGame />
                  </PrivateRoute>
                }
              />
              <Route
                path="/game"
                element={
                  <PrivateRoute>
                    <Game />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />

              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/lobby" />} />
            </Routes>
          </BrowserRouter>
        </ThemeWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
