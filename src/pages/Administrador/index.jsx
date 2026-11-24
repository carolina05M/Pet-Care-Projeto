import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { MODO_DEMO } from "../../config";
import "./Administrador.css";

const MENU = [
  { to: "/administrador", rotulo: "🏠 Início", end: true },
  { to: "/administrador/agendamentos", rotulo: "📅 Agendamentos" },
  { to: "/administrador/servicos", rotulo: "✂️ Serviços" },
  { to: "/administrador/produtos", rotulo: "🛍️ Produtos" },
  { to: "/administrador/categorias", rotulo: "🏷️ Categorias" },
  { to: "/administrador/clientes", rotulo: "👥 Clientes" },
  { to: "/administrador/pets", rotulo: "🐾 Pets" },
  { to: "/administrador/mensagens", rotulo: "✉️ Mensagens" },
];

// Estrutura do painel: menu lateral + área onde entram as páginas internas.
function Administrador() {
  const { perfil } = useAuth();

  return (
    <div className="administrador-layout">
      <aside className="administrador-sidebar">
        <div className="administrador-logo">
          <span>🐾</span>
          <h2>PetCare</h2>
          <p>Painel Administrativo</p>
        </div>

        <nav className="administrador-menu">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "ativo" : undefined)}
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="administrador-conteudo">
        <header className="administrador-cabecalho">
          <div>
            <h1>Administrador</h1>
            {perfil?.nome && (
              <span className="administrador-usuario">Olá, {perfil.nome}</span>
            )}
          </div>
          <Link to="/">← Voltar ao PetCare</Link>
        </header>

        {MODO_DEMO && (
          <p className="administrador-demo" role="note">
            Modo demonstração ligado: é permitido concluir agendamentos que ainda não
            aconteceram. Desligue antes de usar de verdade (VITE_MODO_DEMO=false).
          </p>
        )}

        <Outlet />
      </main>
    </div>
  );
}

export default Administrador;
