import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const links = [
    { nome: "Home", caminho: "/" },
    { nome: "Serviços", caminho: "/servicos" },
    { nome: "Produtos", caminho: "/produtos" },
    { nome: "Sobre", caminho: "/sobre" },
    { nome: "Contato", caminho: "/contato" },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function handleSair() {
    await supabase.auth.signOut();
    setUsuario(null);
    navigate("/");
  }

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

        {/* Botões de acesso (Sem o botão de Meus Agendamentos no topo) */}
        <div className={styles.acoes}>
          {usuario ? (
            <>
              <Link to="/administrador" className={styles.administrador}>
                Administrador
              </Link>

              <button
                type="button"
                onClick={handleSair}
                className={styles.entrar}
                style={{ cursor: "pointer", background: "transparent", border: "none" }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar" className={styles.entrar}>
                Entrar
              </Link>

              <Link to="/administrador" className={styles.administrador}>
                Administrador
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