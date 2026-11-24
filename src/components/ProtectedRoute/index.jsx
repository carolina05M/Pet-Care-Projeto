import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import NaoEncontrado from "../../pages/NaoEncontrado";

// Protege um grupo de rotas.
// - Área do cliente: sem login, manda para /entrar (e volta para a página pedida depois).
// - apenasAdmin: quem não é administrador (logado ou não) vê a página 404, exatamente
//   como num endereço que não existe. Assim a tela não revela que o painel existe.
//   Isso é só um disfarce: a proteção de verdade dos dados está na RLS do banco.
function ProtectedRoute({ apenasAdmin = false }) {
  const { user, isAdmin, carregando } = useAuth();
  const local = useLocation();

  if (carregando) {
    return <p role="status">Carregando...</p>;
  }

  if (apenasAdmin) {
    return user && isAdmin ? <Outlet /> : <NaoEncontrado />;
  }

  if (!user) {
    return <Navigate to="/entrar" replace state={{ de: local }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
