import { useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { cancelarAgendamento } from "../../services/agendamentosService";
import {
  formatarDataHora,
  formatarPreco,
  ROTULOS_STATUS,
} from "../../utils/formatadores";
import styles from "../AreaCliente.module.css";

// Lista reutilizada por "Próximos" e "Histórico". "consulta" precisa ser uma
// função estável (importada de um service). Só os próximos podem ser cancelados.
function ListaAgendamentos({ consulta, mensagemVazio, permitirCancelar = false, filtroStatus = "" }) {
  const { dados, carregando, erro, recarregar } = useConsulta(consulta);
  const [aviso, setAviso] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  async function cancelar(agendamento) {
    if (!window.confirm("Deseja cancelar este agendamento?")) return;

    setAviso("");
    setErroAcao("");
    try {
      await cancelarAgendamento(agendamento.id);
      setAviso("Agendamento cancelado. Você pode vê-lo no histórico.");
      recarregar();
    } catch (falha) {
      setErroAcao(falha.message);
    }
  }

  const visiveis = filtroStatus ? dados?.filter((a) => a.status === filtroStatus) : dados;

  return (
    <>
      {aviso && (
        <p className={styles.aviso} role="status">
          {aviso}
        </p>
      )}
      {erroAcao && (
        <p className={styles.erro} role="alert">
          {erroAcao}
        </p>
      )}

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={visiveis?.length === 0}
        mensagemVazio={mensagemVazio}
        onTentarNovamente={recarregar}
      >
        <ul className={styles.lista}>
          {visiveis?.map((a) => (
            <li key={a.id} className={`${styles.cartao} ${styles.itemAgendamento}`}>
              <div className={styles.itemTexto}>
                <h3>{a.servicos?.nome ?? "Serviço indisponível"}</h3>
                <p className={styles.detalhe}>
                  {a.pets?.nome ?? "Pet removido"} · {formatarDataHora(a.data_hora)}
                  {a.servicos?.preco != null && ` · ${formatarPreco(a.servicos.preco)}`}
                </p>
                {a.observacoes && <p className={styles.detalhe}>{a.observacoes}</p>}
              </div>

              <div className={styles.acoes}>
                <span className={`${styles.etiqueta} ${styles[`status_${a.status}`]}`}>
                  {ROTULOS_STATUS[a.status] ?? a.status}
                </span>
                {permitirCancelar && (
                  <button
                    type="button"
                    className={`${styles.botao} ${styles.botaoPerigo}`}
                    onClick={() => cancelar(a)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </EstadoConsulta>
    </>
  );
}

export default ListaAgendamentos;
