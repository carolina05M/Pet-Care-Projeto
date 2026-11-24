import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  alterarLida,
  excluirMensagem,
  listarMensagens,
} from "../../services/mensagensService";
import { formatarDataHora } from "../../utils/formatadores";
import Avisos from "./Avisos";
import { exibirTelefone } from "../../utils/validacoes";
import styles from "./Admin.module.css";

function AdminMensagens() {
  const { dados: mensagens, carregando, erro, recarregar } = useConsulta(listarMensagens);
  const { aviso, erroAcao, executar } = useAcoes(recarregar);

  function excluir(mensagem) {
    if (!window.confirm(`Excluir a mensagem de ${mensagem.nome}?`)) return;
    executar(() => excluirMensagem(mensagem.id), "Mensagem excluída.");
  }

  const naoLidas = mensagens?.filter((m) => !m.lida).length ?? 0;

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Mensagens</h2>
          <p className={styles.subtitulo}>
            {mensagens ? `${naoLidas} não lida(s) de ${mensagens.length}` : "Mensagens do formulário de contato."}
          </p>
        </div>
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={mensagens?.length === 0}
        mensagemVazio="Nenhuma mensagem recebida."
        onTentarNovamente={recarregar}
      >
        <ul className={styles.listaMensagens}>
          {mensagens?.map((m) => (
            <li key={m.id} className={`${styles.mensagem} ${m.lida ? "" : styles.naoLida}`}>
              <h3>{m.nome}</h3>
              <div className={styles.mutado}>
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.telefone && ` · ${exibirTelefone(m.telefone)}`} · {formatarDataHora(m.created_at)}
              </div>
              <p>{m.mensagem}</p>

              <div className={styles.celulaAcoes}>
                <button
                  type="button"
                  className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                  onClick={() => executar(() => alterarLida(m.id, !m.lida))}
                >
                  {m.lida ? "Marcar como não lida" : "Marcar como lida"}
                </button>
                <button
                  type="button"
                  className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`}
                  onClick={() => excluir(m)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </EstadoConsulta>
    </>
  );
}

export default AdminMensagens;
