import { Link, NavLink, Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../AreaCliente.module.css";

// Estrutura da área "Meus agendamentos": abas Próximos / Histórico + página filha.
function MeusAgendamentos() {
  return (
    <>
      <Header />

      <main className={styles.pagina}>
        <div className={styles.topo}>
          <div>
            <h1>Meus agendamentos</h1>
            <p className={styles.subtitulo}>
              Acompanhe suas solicitações e consulte o histórico.
            </p>
          </div>

          <Link to="/servicos" className={styles.botao}>
            Agendar serviço
          </Link>
        </div>

        <nav className={styles.abas} aria-label="Agendamentos">
          <NavLink
            to="/meus-agendamentos"
            end
            className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
          >
            Próximos
          </NavLink>
          <NavLink
            to="/meus-agendamentos/historico"
            className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
          >
            Histórico
          </NavLink>
        </nav>

        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MeusAgendamentos;
