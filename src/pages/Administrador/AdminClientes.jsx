import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import EstadoConsulta from "../../components/EstadoConsulta";
import ErroCampo from "../../components/ErroCampo";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  alterarAtivoCliente,
  editarCliente,
  listarClientes,
} from "../../services/clientesService";
import Avisos from "./Avisos";
import {
  exibirTelefone,
  formatarTelefone,
  soDigitos,
  temErros,
  validarNomePessoa,
  validarTelefone,
} from "../../utils/validacoes";
import styles from "./Admin.module.css";

function FormularioCliente({ cliente, aoSalvar, aoCancelar }) {
  const [nome, setNome] = useState(cliente.nome ?? "");
  const [telefone, setTelefone] = useState(formatarTelefone(cliente.telefone ?? ""));
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    const novosErros = {
      nome: validarNomePessoa(nome),
      telefone: validarTelefone(telefone),
    };
    setErros(novosErros);
    if (temErros(novosErros)) return;

    setEnviando(true);
    const sucesso = await aoSalvar({ nome, telefone: soDigitos(telefone) });
    if (!sucesso) setEnviando(false);
  }

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <h3>Editar cliente: {cliente.nome}</h3>

      <label htmlFor="admin-cliente-nome">Nome</label>
      <input
        id="admin-cliente-nome"
        value={nome}
        onChange={(evento) => setNome(evento.target.value)}
        maxLength={80}
        required
        aria-invalid={Boolean(erros.nome)}
        aria-describedby="erro-admin-cliente-nome"
      />
      <ErroCampo id="erro-admin-cliente-nome" mensagem={erros.nome} />

      <label htmlFor="admin-cliente-telefone">Telefone (opcional)</label>
      <input
        id="admin-cliente-telefone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="(69) 99999-9999"
        value={telefone}
        onChange={(evento) => setTelefone(formatarTelefone(evento.target.value))}
        maxLength={16}
        aria-invalid={Boolean(erros.telefone)}
        aria-describedby="erro-admin-cliente-telefone"
      />
      <ErroCampo id="erro-admin-cliente-telefone" mensagem={erros.telefone} />

      <p className={styles.mutado}>
        E-mail e senha são gerenciados pelo Supabase Auth e não podem ser alterados por este formulário.
      </p>

      <div className={styles.acoesForm}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          className={`${styles.botao} ${styles.botaoSec}`}
          onClick={aoCancelar}
          disabled={enviando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function AdminClientes() {
  const { user } = useAuth();
  const { dados: clientes, carregando, erro, recarregar } = useConsulta(listarClientes);
  const { aviso, erroAcao, executar, limpar } = useAcoes(recarregar);
  const [editando, setEditando] = useState(null);

  async function salvar(dados) {
    const sucesso = await executar(
      () => editarCliente(editando.id, dados),
      "Dados do cliente atualizados com sucesso."
    );
    if (sucesso) setEditando(null);
    return sucesso;
  }

  function alternar(cliente) {
    const desativar = cliente.ativo;
    const mensagem = desativar
      ? `Desativar ${cliente.nome}? A conta será desconectada e o acesso será bloqueado, mas os dados e o histórico serão preservados.`
      : `Reativar a conta de ${cliente.nome}?`;
    if (!window.confirm(mensagem)) return;

    executar(
      () => alterarAtivoCliente(cliente.id, !cliente.ativo),
      desativar ? "Cliente desativado. Os dados foram preservados." : "Cliente reativado."
    );
  }

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Clientes</h2>
          <p className={styles.subtitulo}>
            Consulte, edite os dados de perfil e controle o acesso dos clientes. Novas contas são criadas pelo cadastro público.
          </p>
        </div>
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando && (
        <FormularioCliente
          key={editando.id}
          cliente={editando}
          aoSalvar={salvar}
          aoCancelar={() => setEditando(null)}
        />
      )}

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={clientes?.length === 0}
        mensagemVazio="Nenhum cliente cadastrado."
        onTentarNovamente={recarregar}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Papel</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes?.map((cliente) => (
                <tr key={cliente.id} className={cliente.ativo ? undefined : styles.inativo}>
                  <td><strong>{cliente.nome}</strong></td>
                  <td>{cliente.telefone ? exibirTelefone(cliente.telefone) : "—"}</td>
                  <td>{cliente.role === "admin" ? "Administrador" : "Cliente"}</td>
                  <td>{new Date(cliente.created_at).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <span className={`${styles.etiqueta} ${cliente.ativo ? styles.on : styles.off}`}>
                      {cliente.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      {cliente.role === "cliente" && (
                        <>
                          <button
                            type="button"
                            className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                            onClick={() => {
                              limpar();
                              setEditando(cliente);
                            }}
                          >
                            Editar
                          </button>
                          {cliente.id !== user?.id && (
                            <button
                              type="button"
                              className={`${styles.botao} ${cliente.ativo ? styles.botaoPerigo : styles.botaoSec} ${styles.botaoPeq}`}
                              onClick={() => alternar(cliente)}
                            >
                              {cliente.ativo ? "Desativar" : "Reativar"}
                            </button>
                          )}
                        </>
                      )}
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

export default AdminClientes;
