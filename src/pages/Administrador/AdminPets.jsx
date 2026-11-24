import { useState } from "react";
import EstadoConsulta from "../../components/EstadoConsulta";
import ErroCampo from "../../components/ErroCampo";
import { useConsulta } from "../../hooks/useConsulta";
import { useAcoes } from "../../hooks/useAcoes";
import {
  excluirPetAdmin,
  listarClientesParaPets,
  listarTodosPetsAdmin,
  salvarPetAdmin,
} from "../../services/petsService";
import { formatarData } from "../../utils/formatadores";
import {
  limitesNascimentoPet,
  temErros,
  validarNascimento,
  validarNomePet,
  validarRaca,
  validarTexto,
} from "../../utils/validacoes";
import Avisos from "./Avisos";
import styles from "./Admin.module.css";

const ESPECIES = [
  { valor: "cachorro", rotulo: "Cachorro" },
  { valor: "gato", rotulo: "Gato" },
  { valor: "outro", rotulo: "Outro" },
];

function FormularioPet({ pet, clientes, aoEnviar, aoCancelar }) {
  const [form, setForm] = useState({
    tutor_id: pet?.tutor_id ?? "",
    nome: pet?.nome ?? "",
    especie: pet?.especie ?? "cachorro",
    raca: pet?.raca ?? "",
    data_nascimento: pet?.data_nascimento ?? "",
    observacoes: pet?.observacoes ?? "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const limites = limitesNascimentoPet();

  function atualizar(campo) {
    return (evento) =>
      setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const novosErros = {
      tutor_id: form.tutor_id ? "" : "Selecione o tutor.",
      nome: validarNomePet(form.nome),
      raca: validarRaca(form.raca),
      data_nascimento: validarNascimento(form.data_nascimento),
      observacoes: validarTexto(form.observacoes, {
        rotulo: "As observações",
        maximo: 500,
      }),
    };
    setErros(novosErros);
    if (temErros(novosErros)) return;

    setEnviando(true);
    const sucesso = await aoEnviar(form);
    if (!sucesso) setEnviando(false);
  }

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <h3>{pet ? `Editar ${pet.nome}` : "Cadastrar pet"}</h3>

      <label htmlFor="admin-pet-tutor">Tutor</label>
      <select
        id="admin-pet-tutor"
        value={form.tutor_id}
        onChange={atualizar("tutor_id")}
        required
        aria-invalid={Boolean(erros.tutor_id)}
        aria-describedby="erro-admin-pet-tutor"
      >
        <option value="">Selecione um cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nome}{cliente.ativo ? "" : " (inativo)"}
          </option>
        ))}
      </select>
      <ErroCampo id="erro-admin-pet-tutor" mensagem={erros.tutor_id} />

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="admin-pet-nome">Nome</label>
          <input
            id="admin-pet-nome"
            value={form.nome}
            onChange={atualizar("nome")}
            maxLength={40}
            required
            aria-invalid={Boolean(erros.nome)}
            aria-describedby="erro-admin-pet-nome"
          />
          <ErroCampo id="erro-admin-pet-nome" mensagem={erros.nome} />
        </div>
        <div>
          <label htmlFor="admin-pet-especie">Espécie</label>
          <select
            id="admin-pet-especie"
            value={form.especie}
            onChange={atualizar("especie")}
            required
          >
            {ESPECIES.map((especie) => (
              <option key={especie.valor} value={especie.valor}>
                {especie.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="admin-pet-raca">Raça (opcional)</label>
          <input
            id="admin-pet-raca"
            value={form.raca}
            onChange={atualizar("raca")}
            maxLength={40}
            aria-invalid={Boolean(erros.raca)}
            aria-describedby="erro-admin-pet-raca"
          />
          <ErroCampo id="erro-admin-pet-raca" mensagem={erros.raca} />
        </div>
        <div>
          <label htmlFor="admin-pet-nascimento">Nascimento (opcional)</label>
          <input
            id="admin-pet-nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={atualizar("data_nascimento")}
            min={limites.min}
            max={limites.max}
            aria-invalid={Boolean(erros.data_nascimento)}
            aria-describedby="erro-admin-pet-nascimento"
          />
          <ErroCampo id="erro-admin-pet-nascimento" mensagem={erros.data_nascimento} />
        </div>
      </div>

      <label htmlFor="admin-pet-observacoes">Observações (opcional)</label>
      <textarea
        id="admin-pet-observacoes"
        rows={3}
        value={form.observacoes}
        onChange={atualizar("observacoes")}
        maxLength={500}
        aria-invalid={Boolean(erros.observacoes)}
        aria-describedby="erro-admin-pet-observacoes"
      />
      <ErroCampo id="erro-admin-pet-observacoes" mensagem={erros.observacoes} />

      <div className={styles.acoesForm}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar pet"}
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

function AdminPets() {
  const {
    dados: pets,
    carregando,
    erro,
    recarregar,
  } = useConsulta(listarTodosPetsAdmin);
  const {
    dados: clientes,
    carregando: carregandoClientes,
    erro: erroClientes,
    recarregar: recarregarClientes,
  } = useConsulta(listarClientesParaPets);
  const { aviso, erroAcao, executar, limpar } = useAcoes(recarregar);
  const [editando, setEditando] = useState(null);

  async function salvar(form) {
    const id = editando === "novo" ? null : editando.id;
    const sucesso = await executar(
      () => salvarPetAdmin(id, form),
      "Pet salvo com sucesso!"
    );
    if (sucesso) setEditando(null);
    return sucesso;
  }

  function excluir(pet) {
    const confirmou = window.confirm(
      `Excluir o pet "${pet.nome}"? ATENÇÃO: os agendamentos vinculados a este pet também poderão ser excluídos pelo relacionamento do banco. Esta ação não pode ser desfeita.`
    );
    if (!confirmou) return;
    executar(() => excluirPetAdmin(pet.id), "Pet excluído com sucesso.");
  }

  const erroGeral = erroClientes || erro;

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h2>Pets</h2>
          <p className={styles.subtitulo}>
            Gerencie os pets cadastrados e seus respectivos tutores.
          </p>
        </div>
        {editando === null && (
          <button
            type="button"
            className={styles.botao}
            disabled={carregandoClientes || Boolean(erroClientes)}
            onClick={() => {
              limpar();
              setEditando("novo");
            }}
          >
            + Novo pet
          </button>
        )}
      </div>

      <Avisos aviso={aviso} erro={erroAcao} />

      {editando !== null && (
        <FormularioPet
          key={editando === "novo" ? "novo" : editando.id}
          pet={editando === "novo" ? null : editando}
          clientes={clientes ?? []}
          aoEnviar={salvar}
          aoCancelar={() => setEditando(null)}
        />
      )}

      {erroGeral && !carregando && (
        <p className={styles.erro} role="alert">
          {erroGeral}
          {erroClientes && (
            <button type="button" className={styles.botao} onClick={recarregarClientes}>
              Tentar carregar clientes novamente
            </button>
          )}
        </p>
      )}

      <EstadoConsulta
        carregando={carregando || carregandoClientes}
        erro={erro}
        vazio={pets?.length === 0}
        mensagemVazio="Nenhum pet cadastrado."
        onTentarNovamente={() => {
          recarregar();
          recarregarClientes();
        }}
      >
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Raça</th>
                <th>Nascimento</th>
                <th>Tutor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pets?.map((pet) => (
                <tr key={pet.id}>
                  <td><strong>{pet.nome}</strong></td>
                  <td>{ESPECIES.find((e) => e.valor === pet.especie)?.rotulo ?? pet.especie}</td>
                  <td>{pet.raca || "—"}</td>
                  <td>{pet.data_nascimento ? formatarData(pet.data_nascimento) : "—"}</td>
                  <td>{pet.tutor?.nome ?? "—"}</td>
                  <td>
                    <div className={styles.celulaAcoes}>
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoSec} ${styles.botaoPeq}`}
                        onClick={() => {
                          limpar();
                          setEditando(pet);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.botao} ${styles.botaoPerigo} ${styles.botaoPeq}`}
                        onClick={() => excluir(pet)}
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

export default AdminPets;
