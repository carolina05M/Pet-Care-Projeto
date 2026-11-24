import styles from "./EstadoConsulta.module.css";

// Mostra carregando / erro / vazio. Quando nenhum se aplica, renderiza os filhos.
function EstadoConsulta({
  carregando,
  erro,
  vazio,
  mensagemVazio = "Nada por aqui ainda.",
  onTentarNovamente,
  children,
}) {
  if (carregando) {
    return (
      <p className={styles.estado} role="status">
        Carregando...
      </p>
    );
  }

  if (erro) {
    return (
      <div className={`${styles.estado} ${styles.erro}`} role="alert">
        <p>{erro}</p>
        {onTentarNovamente && (
          <button type="button" onClick={onTentarNovamente}>
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (vazio) {
    return <p className={styles.estado}>{mensagemVazio}</p>;
  }

  return children;
}

export default EstadoConsulta;
