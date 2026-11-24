import { useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  excluirCategoria,
  listarCategorias,
  salvarCategoria,
} from "../../services/categoriasService";
import Avisos from "./Avisos";
import styles from "./Admin.module.css";

function FormularioCategoria({ categoria, aoEnviar, aoCancelar }) {
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    const ok = await aoEnviar({ nome });
    if (!ok) setEnviando(false);
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <h3>{categoria ? `Editar ${categoria.nome}` : "Nova categoria"}</h3>

      <label htmlFor="cat-nome">Nome</label>
      <input id="cat-nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={60} required />

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

function AdminCategorias() {
  const { dados: categorias, carregando, erro, recarregar } = useConsulta(listarCategorias);
  const { aviso, erroAcao, executar, limpar } = useAcoes(recarregar);
  const [editando, setEditando] = useState(null); // null | "nova" | categoria

  async function salvar(form) {
    const id = editando === "nova" ? null : editando.id;
    const ok = await executar(() => salvarCategoria(id, form), "Categoria salva com sucesso!");
    if (ok) setEditando(null);
    return ok;
  }

  function excluir(categoria) {
    const confirmou = window.confirm(
      `Excluir a categoria "${categoria.nome}"? Os produtos dela ficarão sem categoria.`
    );
    if (!confirmou) return;
    executar(() => excluirCategoria(categoria.id), "Categoria excluída.");
  }

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Categorias</h2>
          <p className={styles.subtitulo}>Usadas no filtro da página de produtos.</p>
        </div>
        {editando === null && (
          <button type="button" className={styles.botao} onClick={() => { limpar(); setEditando("nova"); }}>
            + Nova categoria
          </button>
        )}
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando !== null && (
        <FormularioCategoria
          key={editando === "nova" ? "nova" : editando.id}
          categoria={editando === "nova" ? null : editando}
          aoEnviar={salvar}
          aoCancelar={() => setEditando(null)}
        />
      )}

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={categorias?.length === 0}
        mensagemVazio="Nenhuma categoria cadastrada."
        onTentarNovamente={recarregar}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias?.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.nome}</strong></td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      <button type="button" className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`} onClick={() => { limpar(); setEditando(c); }}>
                        Editar
                      </button>
                      <button type="button" className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`} onClick={() => excluir(c)}>
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

export default AdminCategorias;
