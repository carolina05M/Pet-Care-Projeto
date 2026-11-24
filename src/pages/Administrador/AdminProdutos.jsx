import { useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  alterarAtivoProduto,
  excluirProduto,
  listarTodosProdutos,
  salvarProduto,
} from "../../services/produtosService";
import { listarCategorias } from "../../services/categoriasService";
import { formatarPreco } from "../../utils/formatadores";
import Avisos from "./Avisos";
import styles from "./Admin.module.css";

const ICONES = [
  { valor: "racao", rotulo: "Ração" },
  { valor: "mordedor", rotulo: "Mordedor" },
  { valor: "caminha", rotulo: "Caminha" },
  { valor: "shampoo", rotulo: "Shampoo" },
  { valor: "bolinha", rotulo: "Bolinha" },
  { valor: "coleira", rotulo: "Coleira" },
  { valor: "carrinho", rotulo: "Carrinho" },
];

function FormularioProduto({ produto, categorias, aoEnviar, aoCancelar }) {
  const [form, setForm] = useState({
    nome: produto?.nome ?? "",
    descricao: produto?.descricao ?? "",
    preco: produto?.preco ?? "",
    estoque: produto?.estoque ?? 0,
    categoria_id: produto?.categoria_id ?? "",
    icone: produto?.icone ?? "caminha",
    ativo: produto?.ativo ?? true,
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
      <h3>{produto ? `Editar ${produto.nome}` : "Novo produto"}</h3>

      <label htmlFor="prd-nome">Nome</label>
      <input id="prd-nome" value={form.nome} onChange={atualizar("nome")} maxLength={80} required />

      <label htmlFor="prd-desc">Descrição</label>
      <textarea id="prd-desc" rows={2} value={form.descricao} onChange={atualizar("descricao")} maxLength={300} />

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="prd-preco">Preço (R$)</label>
          <input id="prd-preco" type="number" min="0" step="0.01" value={form.preco} onChange={atualizar("preco")} required />
        </div>
        <div>
          <label htmlFor="prd-estoque">Estoque</label>
          <input id="prd-estoque" type="number" min="0" step="1" value={form.estoque} onChange={atualizar("estoque")} required />
        </div>
        <div>
          <label htmlFor="prd-cat">Categoria</label>
          <select id="prd-cat" value={form.categoria_id} onChange={atualizar("categoria_id")}>
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prd-icone">Ícone</label>
          <select id="prd-icone" value={form.icone} onChange={atualizar("icone")}>
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

function AdminProdutos() {
  const produtosQ = useConsulta(listarTodosProdutos);
  const categoriasQ = useConsulta(listarCategorias);
  const { aviso, erroAcao, executar, limpar } = useAcoes(produtosQ.recarregar);
  const [editando, setEditando] = useState(null); // null | "novo" | produto

  async function salvar(form) {
    const id = editando === "novo" ? null : editando.id;
    const ok = await executar(() => salvarProduto(id, form), "Produto salvo com sucesso!");
    if (ok) setEditando(null);
    return ok;
  }

  function excluir(produto) {
    if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return;
    executar(() => excluirProduto(produto.id), "Produto excluído.");
  }

  const produtos = produtosQ.dados;

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Produtos</h2>
          <p className={styles.subtitulo}>Produtos inativos não aparecem na loja.</p>
        </div>
        {editando === null && (
          <button type="button" className={styles.botao} onClick={() => { limpar(); setEditando("novo"); }}>
            + Novo produto
          </button>
        )}
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando !== null && (
        <FormularioProduto
          key={editando === "novo" ? "novo" : editando.id}
          produto={editando === "novo" ? null : editando}
          categorias={categoriasQ.dados ?? []}
          aoEnviar={salvar}
          aoCancelar={() => setEditando(null)}
        />
      )}

      <EstadoConsulta
        carregando={produtosQ.carregando}
        erro={produtosQ.erro}
        vazio={produtos?.length === 0}
        mensagemVazio="Nenhum produto cadastrado."
        onTentarNovamente={produtosQ.recarregar}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos?.map((p) => (
                <tr key={p.id} className={p.ativo ? undefined : styles.inativo}>
                  <td>
                    <strong>{p.nome}</strong>
                    <div className={styles.mutado}>{p.descricao}</div>
                  </td>
                  <td>{p.categorias?.nome ?? "Sem categoria"}</td>
                  <td>{formatarPreco(p.preco)}</td>
                  <td>{p.estoque}</td>
                  <td>
                    <span className={`${styles.etiqueta} ${p.ativo ? styles.on : styles.off}`}>
                      {p.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      <button type="button" className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`} onClick={() => { limpar(); setEditando(p); }}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                        onClick={() => executar(() => alterarAtivoProduto(p.id, !p.ativo), p.ativo ? "Produto desativado." : "Produto ativado.")}
                      >
                        {p.ativo ? "Desativar" : "Ativar"}
                      </button>
                      <button type="button" className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`} onClick={() => excluir(p)}>
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

export default AdminProdutos;
