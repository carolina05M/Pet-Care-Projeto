import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EstadoConsulta from "../../components/EstadoConsulta";
import ErroCampo from "../../components/ErroCampo";
import { useConsulta } from "../../hooks/useConsulta";
import {
  atualizarPet,
  criarPet,
  excluirPet,
  listarMeusPets,
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
import styles from "../AreaCliente.module.css";

const ESPECIES = [
  { valor: "cachorro", rotulo: "Cachorro", emoji: "🐶" },
  { valor: "gato", rotulo: "Gato", emoji: "🐱" },
  { valor: "outro", rotulo: "Outro", emoji: "🐾" },
];

function dadosEspecie(valor) {
  return ESPECIES.find((e) => e.valor === valor) ?? ESPECIES[2];
}

// Usado para criar (pet = null) ou editar. O "key" no uso reinicia o formulário.
function FormularioPet({ pet, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState({
    nome: pet?.nome ?? "",
    especie: pet?.especie ?? "cachorro",
    raca: pet?.raca ?? "",
    data_nascimento: pet?.data_nascimento ?? "",
    observacoes: pet?.observacoes ?? "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});
  const limites = limitesNascimentoPet();

  function atualizar(campo) {
    return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");

    const novosErros = {
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

    try {
      if (pet) await atualizarPet(pet.id, form);
      else await criarPet(form);
      aoSalvar();
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <form className={`${styles.cartao} ${styles.formulario}`} onSubmit={enviar} noValidate>
      <h2>{pet ? `Editar ${pet.nome}` : "Novo pet"}</h2>

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="pet-nome">Nome</label>
          <input
            id="pet-nome"
            type="text"
            value={form.nome}
            onChange={atualizar("nome")}
            maxLength={40}
            aria-invalid={Boolean(erros.nome)}
            aria-describedby="erro-pet-nome"
          />
          <ErroCampo id="erro-pet-nome" mensagem={erros.nome} />
        </div>

        <div>
          <label htmlFor="pet-especie">Espécie</label>
          <select
            id="pet-especie"
            value={form.especie}
            onChange={atualizar("especie")}
            required
          >
            {ESPECIES.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.linhaCampos}>
        <div>
          <label htmlFor="pet-raca">Raça (opcional)</label>
          <input
            id="pet-raca"
            type="text"
            value={form.raca}
            onChange={atualizar("raca")}
            maxLength={40}
            aria-invalid={Boolean(erros.raca)}
            aria-describedby="erro-pet-raca"
          />
          <ErroCampo id="erro-pet-raca" mensagem={erros.raca} />
        </div>

        <div>
          <label htmlFor="pet-nascimento">Nascimento (opcional)</label>
          <input
            id="pet-nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={atualizar("data_nascimento")}
            min={limites.min}
            max={limites.max}
            aria-invalid={Boolean(erros.data_nascimento)}
            aria-describedby="erro-pet-nascimento"
          />
          <ErroCampo id="erro-pet-nascimento" mensagem={erros.data_nascimento} />
        </div>
      </div>

      <label htmlFor="pet-obs">Observações (opcional)</label>
      <textarea
        id="pet-obs"
        rows={3}
        value={form.observacoes}
        onChange={atualizar("observacoes")}
        maxLength={500}
        placeholder="Alergias, temperamento, cuidados especiais..."
        aria-invalid={Boolean(erros.observacoes)}
        aria-describedby="erro-pet-obs"
      />
      <ErroCampo id="erro-pet-obs" mensagem={erros.observacoes} />

      <div className={styles.acoes}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          className={`${styles.botao} ${styles.botaoSecundario}`}
          onClick={aoCancelar}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function MeusPets() {
  const { dados: pets, carregando, erro, recarregar } = useConsulta(listarMeusPets);

  // null = formulário fechado | "novo" = cadastro | objeto do pet = edição
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  function aoSalvar() {
    setEditando(null);
    setErroAcao("");
    setAviso("Pet salvo com sucesso!");
    recarregar();
  }

  async function excluir(pet) {
    const confirmou = window.confirm(
      `Excluir ${pet.nome}? Os agendamentos deste pet também serão apagados.`
    );
    if (!confirmou) return;

    setAviso("");
    setErroAcao("");
    try {
      await excluirPet(pet.id);
      setAviso(`${pet.nome} foi excluído.`);
      recarregar();
    } catch (falha) {
      setErroAcao(falha.message);
    }
  }

  return (
    <>
      <Header />

      <main className={styles.pagina}>
        <div className={styles.topo}>
          <div>
            <h1>Meus pets</h1>
            <p className={styles.subtitulo}>
              Cadastre seus pets para agendar serviços.
            </p>
          </div>

          {editando === null && (
            <button
              type="button"
              className={styles.botao}
              onClick={() => {
                setAviso("");
                setEditando("novo");
              }}
            >
              + Novo pet
            </button>
          )}
        </div>

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

        {editando !== null && (
          <FormularioPet
            key={editando === "novo" ? "novo" : editando.id}
            pet={editando === "novo" ? null : editando}
            aoSalvar={aoSalvar}
            aoCancelar={() => setEditando(null)}
          />
        )}

        <EstadoConsulta
          carregando={carregando}
          erro={erro}
          vazio={pets?.length === 0}
          mensagemVazio="Você ainda não cadastrou nenhum pet. Clique em “Novo pet” para começar."
          onTentarNovamente={recarregar}
        >
          <div className={styles.grade}>
            {pets?.map((pet) => {
              const especie = dadosEspecie(pet.especie);
              return (
                <article className={styles.cartao} key={pet.id}>
                  <h3>
                    {especie.emoji} {pet.nome}
                  </h3>
                  <p className={styles.detalhe}>
                    {especie.rotulo}
                    {pet.raca ? ` · ${pet.raca}` : ""}
                  </p>
                  {pet.data_nascimento && (
                    <p className={styles.detalhe}>
                      Nascimento: {formatarData(pet.data_nascimento)}
                    </p>
                  )}
                  {pet.observacoes && <p>{pet.observacoes}</p>}

                  <div className={styles.acoes}>
                    <button
                      type="button"
                      className={`${styles.botao} ${styles.botaoSecundario}`}
                      onClick={() => {
                        setAviso("");
                        setEditando(pet);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`${styles.botao} ${styles.botaoPerigo}`}
                      onClick={() => excluir(pet)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </EstadoConsulta>
      </main>

      <Footer />
    </>
  );
}

export default MeusPets;
