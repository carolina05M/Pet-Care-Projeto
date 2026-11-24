import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./Header.module.css";

function Header() {
  const { user, perfil, isAdmin, sair } = useAuth();

  const links = [
    { nome: "Home", caminho: "/" },
    { nome: "Serviços", caminho: "/servicos" },
    { nome: "Produtos", caminho: "/produtos" },
    { nome: "Sobre", caminho: "/sobre" },
    { nome: "Contato", caminho: "/contato" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.patinha}>🐾</span>
          <span>PetCare</span>
        </Link>

        {/* Menu de navegação */}
        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.caminho}
              to={link.caminho}
              end={link.caminho === "/"}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.active}`
                  : styles.navLink
              }
            >
              {link.nome}
            </NavLink>
          ))}
        </nav>

        {/* Botões de acesso */}
        <div className={styles.acoes}>
          {user ? (
            <>
              <span className={styles.saudacao}>
                Olá, {perfil?.nome ?? "tutor"}
              </span>

              <Link to="/minha-conta" className={styles.administrador}>
                Minha conta
              </Link>

              {isAdmin && (
                <Link to="/administrador" className={styles.administrador}>
                  Administrador
                </Link>
              )}

              <button type="button" onClick={sair} className={styles.entrar}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar" className={styles.entrar}>
                Entrar
              </Link>

              <Link to="/entrar" className={styles.comecar}>
                Começar grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;