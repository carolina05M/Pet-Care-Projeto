import styles from "./Admin.module.css";

// Mensagens de sucesso/erro das ações, no topo de cada página do painel.
function Avisos({ aviso, erro }) {
  return (
    <>
      {aviso && (
        <p className={styles.aviso} role="status">
          {aviso}
        </p>
      )}
      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}
    </>
  );
}

export default Avisos;
