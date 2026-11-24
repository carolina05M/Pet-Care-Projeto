import { useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  alterarAtivoServico,
  excluirServico,
  listarTodosServicos,
  salvarServico,
} from "../../services/servicosService";
import { formatarDuracao, formatarPreco } from "../../utils/formatadores";
import Avisos from "./Avisos";
import styles from "./Admin.module.css";

const ICONES = [
  { valor: "banho", rotulo: "Banho" },
  { valor: "tesoura", rotulo: "Tesoura" },
  { valor: "patas", rotulo: "Patas" },
  { valor: "hidratacao", rotulo: "Hidratação" },
  { valor: "escovacao", rotulo: "Escovação" },
  { valor: "coracao", rotulo: "Coração" },
];

function FormularioServico({ servico, aoEnviar, aoCancelar }) {
  const [form, setForm] = useState({
    nome: servico?.nome ?? "",
    descricao: servico?.descricao ?? "",
    preco: servico?.preco ?? "",
    duracao_minutos: servico?.duracao_minutos ?? "",
    icone: servico?.icone ?? "coracao",
    ativo: servico?.ativo ?? true,
  });
  const [enviando, setEnviando] = useState(false);

  function atualizar(campo) {
    return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    const ok = await aoEnviar(form);
    if (!ok) setEnviando(false);
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <h3>{servico ? `Editar ${servico.nome}` : "Novo serviço"}</h3>

      <label htmlFor="srv-nome">Nome</label>
      <input id="srv-nome" value={form.nome} onChange={atualizar("nome")} maxLength={80} required />

      <label htmlFor="srv-desc">Descrição</label>
      <textarea id="srv-desc" rows={2} value={form.descricao} onChange={atualizar("descricao")} maxLength={300} />

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="srv-preco">Preço (R$)</label>
          <input id="srv-preco" type="number" min="0" step="0.01" value={form.preco} onChange={atualizar("preco")} required />
        </div>
        <div>
          <label htmlFor="srv-duracao">Duração (minutos)</label>
          <input id="srv-duracao" type="number" min="1" step="1" value={form.duracao_minutos} onChange={atualizar("duracao_minutos")} required />
        </div>
        <div>
          <label htmlFor="srv-icone">Ícone</label>
          <select id="srv-icone" value={form.icone} onChange={atualizar("icone")}>
            {ICONES.map((i) => (
              <option key={i.valor} value={i.valor}>{i.rotulo}</option>
            ))}
          </select>
        </div>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={form.ativo}
          onChange={(e) => setForm((atual) => ({ ...atual, ativo: e.target.checked }))}
        />
        Ativo (visível para os clientes)
      </label>

      <div className={styles.acoesForm}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" className={`${styles.botao} ${styles.botaoSec}`} onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function AdminServicos() {
  const { dados: servicos, carregando, erro, recarregar } = useConsulta(listarTodosServicos);
  const { aviso, erroAcao, executar, limpar } = useAcoes(recarregar);
  const [editando, setEditando] = useState(null); // null | "novo" | serviço

  async function salvar(form) {
    const id = editando === "novo" ? null : editando.id;
    const ok = await executar(() => salvarServico(id, form), "Serviço salvo com sucesso!");
    if (ok) setEditando(null);
    return ok;
  }

  function excluir(servico) {
    if (!window.confirm(`Excluir o serviço "${servico.nome}"?`)) return;
    executar(() => excluirServico(servico.id), "Serviço excluído.");
  }

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Serviços</h2>
          <p className={styles.subtitulo}>Serviços com agendamentos não podem ser excluídos; desative-os.</p>
        </div>
        {editando === null && (
          <button type="button" className={styles.botao} onClick={() => { limpar(); setEditando("novo"); }}>
            + Novo serviço
          </button>
        )}
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando !== null && (
        <FormularioServico
          key={editando === "novo" ? "novo" : editando.id}
          servico={editando === "novo" ? null : editando}
          aoEnviar={salvar}
          aoCancelar={() => setEditando(null)}
        />
      )}

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={servicos?.length === 0}
        mensagemVazio="Nenhum serviço cadastrado."
        onTentarNovamente={recarregar}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Duração</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos?.map((s) => (
                <tr key={s.id} className={s.ativo ? undefined : styles.inativo}>
                  <td>
                    <strong>{s.nome}</strong>
                    <div className={styles.mutado}>{s.descricao}</div>
                  </td>
                  <td>{formatarPreco(s.preco)}</td>
                  <td>{formatarDuracao(s.duracao_minutos)}</td>
                  <td>
                    <span className={`${styles.etiqueta} ${s.ativo ? styles.on : styles.off}`}>
                      {s.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      <button type="button" className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`} onClick={() => { limpar(); setEditando(s); }}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                        onClick={() => executar(() => alterarAtivoServico(s.id, !s.ativo), s.ativo ? "Serviço desativado." : "Serviço ativado.")}
                      >
                        {s.ativo ? "Desativar" : "Ativar"}
                      </button>
                      <button type="button" className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`} onClick={() => excluir(s)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoConsulta>
    </>
  );
}

export default AdminServicos;
