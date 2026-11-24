import { useCallback, useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  alterarStatusAgendamento,
  carregarOpcoesAgendamentoAdmin,
  excluirAgendamentoAdmin,
  listarAgendamentosAdmin,
  podeConcluir,
  salvarAgendamentoAdmin,
} from "../../services/agendamentosService";
import {
  formatarDataHora,
  formatarDuracao,
  formatarPreco,
  ROTULOS_STATUS,
} from "../../utils/formatadores";
import { exibirTelefone } from "../../utils/validacoes";
import Avisos from "./Avisos";
import styles from "./Admin.module.css";

const FILTROS_STATUS = {
  andamento: { rotulo: "Em andamento", status: ["pendente", "confirmado"] },
  pendente: { rotulo: "Pendentes", status: ["pendente"] },
  confirmado: { rotulo: "Confirmados", status: ["confirmado"] },
  concluido: { rotulo: "Concluídos", status: ["concluido"] },
  cancelado: { rotulo: "Cancelados", status: ["cancelado"] },
  todos: { rotulo: "Todos", status: null },
};

const STATUS = ["pendente", "confirmado", "concluido", "cancelado"];

function formatarParaFormulario(dataHora) {
  if (!dataHora) return { data: "", horario: "" };

  const data = new Date(dataHora);
  if (Number.isNaN(data.getTime())) return { data: "", horario: "" };

  const pad = (valor) => String(valor).padStart(2, "0");
  return {
    data: `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`,
    horario: `${pad(data.getHours())}:${pad(data.getMinutes())}`,
  };
}

function criarEstadoInicial(agendamento) {
  return {
    cliente_id: agendamento?.cliente_id ?? "",
    pet_id: agendamento?.pet_id ?? "",
    servico_id: agendamento?.servico_id ? String(agendamento.servico_id) : "",
    ...formatarParaFormulario(agendamento?.data_hora),
    status: agendamento?.status ?? "pendente",
    observacoes: agendamento?.observacoes ?? "",
  };
}

function FormularioAgendamento({
  agendamento,
  clientes,
  pets,
  servicos,
  aoEnviar,
  aoCancelar,
}) {
  const [form, setForm] = useState(() => criarEstadoInicial(agendamento));
  const [enviando, setEnviando] = useState(false);

  const petsDoCliente = pets.filter((pet) => pet.tutor_id === form.cliente_id);
  const podeManterClienteInativo = Boolean(
    agendamento && clientes.some((cliente) => cliente.id === form.cliente_id && !cliente.ativo)
  );
  const podeManterServicoInativo = Boolean(
    agendamento && servicos.some((servico) => String(servico.id) === form.servico_id && !servico.ativo)
  );

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    await aoEnviar(form);
    setEnviando(false);
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <h3>{agendamento ? "Editar agendamento" : "Novo agendamento"}</h3>

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="agendamento-cliente">Cliente</label>
          <select
            id="agendamento-cliente"
            value={form.cliente_id}
            onChange={(evento) =>
              setForm((atual) => ({
                ...atual,
                cliente_id: evento.target.value,
                pet_id: "",
              }))
            }
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option
                key={cliente.id}
                value={cliente.id}
                disabled={!cliente.ativo && !(podeManterClienteInativo && cliente.id === form.cliente_id)}
              >
                {cliente.nome}{cliente.ativo ? "" : " (inativo)"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="agendamento-pet">Pet</label>
          <select
            id="agendamento-pet"
            value={form.pet_id}
            onChange={(evento) => alterar("pet_id", evento.target.value)}
            required
            disabled={!form.cliente_id || petsDoCliente.length === 0}
          >
            <option value="">Selecione o pet</option>
            {petsDoCliente.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nome} ({pet.especie})
              </option>
            ))}
          </select>
          {form.cliente_id && petsDoCliente.length === 0 && (
            <p className={styles.mutado}>Este cliente ainda não possui pets cadastrados.</p>
          )}
        </div>

        <div>
          <label htmlFor="agendamento-servico">Serviço</label>
          <select
            id="agendamento-servico"
            value={form.servico_id}
            onChange={(evento) => alterar("servico_id", evento.target.value)}
            required
          >
            <option value="">Selecione o serviço</option>
            {servicos.map((servico) => (
              <option
                key={servico.id}
                value={String(servico.id)}
                disabled={!servico.ativo && !(podeManterServicoInativo && String(servico.id) === form.servico_id)}
              >
                {servico.nome} — {formatarPreco(servico.preco)} ({formatarDuracao(servico.duracao_minutos)})
                {servico.ativo ? "" : " (inativo)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="agendamento-data">Data</label>
          <input
            id="agendamento-data"
            type="date"
            value={form.data}
            onChange={(evento) => alterar("data", evento.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="agendamento-horario">Horário</label>
          <input
            id="agendamento-horario"
            type="time"
            value={form.horario}
            onChange={(evento) => alterar("horario", evento.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="agendamento-status">Status</label>
          <select
            id="agendamento-status"
            value={form.status}
            onChange={(evento) => alterar("status", evento.target.value)}
            required
          >
            {STATUS.map((status) => (
              <option key={status} value={status}>
                {ROTULOS_STATUS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="agendamento-observacoes">Observações</label>
        <textarea
          id="agendamento-observacoes"
          rows="3"
          maxLength={500}
          value={form.observacoes}
          onChange={(evento) => alterar("observacoes", evento.target.value)}
          placeholder="Informações importantes sobre o atendimento (opcional)"
        />
      </div>

      <div className={styles.acoesForm}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar agendamento"}
        </button>
        <button
          type="button"
          className={`${styles.botao} ${styles.botaoSec}`}
          onClick={aoCancelar}
          disabled={enviando}
        >
          Cancelar edição
        </button>
      </div>
    </form>
  );
}

function AdminAgendamentos() {
  const [data, setData] = useState("");
  const [filtro, setFiltro] = useState("andamento");
  const [editando, setEditando] = useState(null); // null | "novo" | objeto do agendamento

  const consulta = useCallback(
    () =>
      listarAgendamentosAdmin({
        data,
        status: FILTROS_STATUS[filtro].status,
        crescente: filtro === "andamento" || filtro === "pendente" || filtro === "confirmado",
      }),
    [data, filtro]
  );

  const { dados, carregando, erro, recarregar } = useConsulta(consulta);
  const {
    dados: opcoes,
    carregando: carregandoOpcoes,
    erro: erroOpcoes,
    recarregar: recarregarOpcoes,
  } = useConsulta(carregarOpcoesAgendamentoAdmin);
  const { aviso, erroAcao, executar, limpar } = useAcoes(recarregar);

  async function salvar(formulario) {
    const id = editando === "novo" ? null : editando?.id;
    const sucesso = await executar(
      () => salvarAgendamentoAdmin(id, formulario),
      id ? "Agendamento atualizado com sucesso." : "Agendamento cadastrado com sucesso."
    );
    if (sucesso) setEditando(null);
  }

  function mudarStatus(agendamento, novoStatus, mensagem, confirmacao) {
    if (confirmacao && !window.confirm(confirmacao)) return;
    executar(
      () =>
        alterarStatusAgendamento(agendamento.id, novoStatus, {
          dataHora: agendamento.data_hora,
        }),
      mensagem
    );
  }

  function excluir(agendamento) {
    const cliente = agendamento.cliente?.nome ?? "cliente não identificado";
    const pet = agendamento.pet?.nome ?? "pet não identificado";
    const confirmacao = `Excluir definitivamente o agendamento de ${pet} (${cliente}) em ${formatarDataHora(agendamento.data_hora)}?`;
    if (!window.confirm(confirmacao)) return;

    executar(
      () => excluirAgendamentoAdmin(agendamento.id),
      "Agendamento excluído."
    );
  }

  function abrirNovo() {
    limpar();
    setEditando("novo");
  }

  function abrirEdicao(agendamento) {
    limpar();
    setEditando(agendamento);
  }

  const clientes = opcoes?.clientes ?? [];
  const pets = opcoes?.pets ?? [];
  const servicos = opcoes?.servicos ?? [];

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Agendamentos</h2>
          <p className={styles.subtitulo}>
            Cadastre, consulte, edite, altere o status ou exclua agendamentos.
          </p>
        </div>
        {editando === null && (
          <button type="button" className={styles.botao} onClick={abrirNovo}>
            + Novo agendamento
          </button>
        )}
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando !== null && (
        carregandoOpcoes ? (
          <p className={styles.mutado} role="status">Carregando clientes, pets e serviços...</p>
        ) : erroOpcoes ? (
          <div className={styles.erro} role="alert">
            <p>Não foi possível carregar as opções do formulário: {erroOpcoes}</p>
            <button type="button" className={`${styles.botao} ${styles.botaoSec}`} onClick={recarregarOpcoes}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <FormularioAgendamento
            key={editando === "novo" ? "novo" : editando.id}
            agendamento={editando === "novo" ? null : editando}
            clientes={clientes}
            pets={pets}
            servicos={servicos}
            aoEnviar={salvar}
            aoCancelar={() => setEditando(null)}
          />
        )
      )}

      <div className={styles.filtros}>
        <div>
          <label htmlFor="filtro-data-agendamentos">Data</label>
          <input
            id="filtro-data-agendamentos"
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filtro-status-agendamentos">Status</label>
          <select
            id="filtro-status-agendamentos"
            value={filtro}
            onChange={(evento) => setFiltro(evento.target.value)}
          >
            {Object.entries(FILTROS_STATUS).map(([valor, item]) => (
              <option key={valor} value={valor}>{item.rotulo}</option>
            ))}
          </select>
        </div>
        {(data || filtro !== "andamento") && (
          <button
            type="button"
            className={`${styles.botao} ${styles.botaoSec}`}
            onClick={() => { setData(""); setFiltro("andamento"); }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={dados?.length === 0}
        mensagemVazio="Nenhum agendamento encontrado com esses filtros."
        onTentarNovamente={recarregar}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Data e hora</th>
                <th>Cliente</th>
                <th>Pet</th>
                <th>Serviço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados?.map((agendamento) => (
                <tr key={agendamento.id}>
                  <td>{formatarDataHora(agendamento.data_hora)}</td>
                  <td>
                    <strong>{agendamento.cliente?.nome ?? "—"}</strong>
                    <div className={styles.mutado}>
                      {exibirTelefone(agendamento.cliente?.telefone)}
                    </div>
                  </td>
                  <td>
                    {agendamento.pet?.nome ?? "—"}
                    {agendamento.pet?.especie && (
                      <div className={styles.mutado}>{agendamento.pet.especie}</div>
                    )}
                  </td>
                  <td>
                    {agendamento.servico?.nome ?? "—"}
                    {agendamento.servico?.preco != null && (
                      <div className={styles.mutado}>
                        {formatarPreco(agendamento.servico.preco)}
                        {agendamento.servico.duracao_minutos
                          ? ` · ${formatarDuracao(agendamento.servico.duracao_minutos)}`
                          : ""}
                      </div>
                    )}
                    {agendamento.observacoes && (
                      <div className={styles.mutado}>Obs.: {agendamento.observacoes}</div>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.etiqueta} ${styles[`status_${agendamento.status}`]}`}>
                      {ROTULOS_STATUS[agendamento.status] ?? agendamento.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      {agendamento.status === "pendente" && (
                        <button
                          type="button"
                          className={`${styles.botao} ${styles.botaoPeq}`}
                          onClick={() => mudarStatus(agendamento, "confirmado", "Agendamento confirmado.")}
                        >
                          Confirmar
                        </button>
                      )}
                      {agendamento.status === "confirmado" && (
                        <button
                          type="button"
                          className={`${styles.botao} ${styles.botaoPeq}`}
                          disabled={!podeConcluir(agendamento.data_hora)}
                          title={
                            podeConcluir(agendamento.data_hora)
                              ? undefined
                              : "Só é possível concluir depois do horário agendado."
                          }
                          onClick={() => mudarStatus(agendamento, "concluido", "Agendamento concluído.")}
                        >
                          Concluir
                        </button>
                      )}
                      {(agendamento.status === "pendente" || agendamento.status === "confirmado") && (
                        <button
                          type="button"
                          className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`}
                          onClick={() => mudarStatus(
                            agendamento,
                            "cancelado",
                            "Agendamento cancelado.",
                            "Cancelar este agendamento?"
                          )}
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                        onClick={() => abrirEdicao(agendamento)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`}
                        onClick={() => excluir(agendamento)}
                      >
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

export default AdminAgendamentos;
