import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Servicos.css";

function IconeServico({ tipo = "banho", tamanho = 32 }) {
  const icones = {
    banho: (
      <>
        <path d="M4 14h16l-2 6H6l-2-6Z" />
        <path d="M7 14V8a5 5 0 0 1 10 0v1" />
        <path d="M9 17h.01M13 17h.01M17 17h.01" />
        <path d="M3 22h18" />
      </>
    ),
    tesoura: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m8.2 8.2 12 12M8.2 15.8l12-12" />
      </>
    ),
    patas: (
      <>
        <ellipse cx="12" cy="16" rx="5" ry="4" />
        <ellipse cx="5.5" cy="10" rx="2" ry="3" transform="rotate(-25 5.5 10)" />
        <ellipse cx="10" cy="6.5" rx="2" ry="3" />
        <ellipse cx="15" cy="6.5" rx="2" ry="3" />
        <ellipse cx="18.5" cy="10" rx="2" ry="3" transform="rotate(25 18.5 10)" />
      </>
    ),
    hidratacao: (
      <>
        <path d="M9 3h6v3l2 2v13H7V8l2-2V3Z" />
        <path d="M9 3h6M7 10h10" />
        <path d="M12 13c-1.5 2-2 2.7-2 3.7a2 2 0 0 0 4 0c0-1-.5-1.7-2-3.7Z" />
      </>
    ),
    escovacao: (
      <>
        <path d="M5 4v6M9 4v6M13 4v6M17 4v6M21 4v6" />
        <path d="M3 10h20v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Z" />
        <path d="M8 17v3M12 17v3M16 17v3" />
      </>
    ),
    coracao: (
      <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    ),
  };

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icones[tipo] || icones.banho}
    </svg>
  );
}

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [nomeTutor, setNomeTutor] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState("levar");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroAgendamento, setErroAgendamento] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function inicializar() {
      setCarregando(true);

      // 1. Verificar se há um cliente logado no Supabase Auth
      const { data: sessao } = await supabase.auth.getUser();
      if (sessao?.user) {
        setUsuarioLogado(sessao.user);
      }

      // 2. Carregar catálogo de serviços
      const { data: dadosServicos, error } = await supabase
        .from("servicos")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao buscar serviços:", error);
      } else if (dadosServicos) {
        setServicos(dadosServicos);
      }
      setCarregando(false);
    }

    inicializar();
  }, []);

  function descobrirIcone(nome) {
    const n = nome.toLowerCase();
    if (n.includes("tosa")) return "tesoura";
    if (n.includes("banho")) return "banho";
    if (n.includes("unha")) return "patas";
    if (n.includes("hidrata")) return "hidratacao";
    if (n.includes("escova")) return "escovacao";
    if (n.includes("cuidados") || n.includes("dia")) return "coracao";
    return "banho";
  }

  function formatarDuracao(minutos) {
    if (!minutos) return "1 hora";
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0 && mins > 0) return `${horas} hora${horas > 1 ? "s" : ""} e ${mins} minutos`;
    if (horas > 0) return `${horas} hora${horas > 1 ? "s" : ""}`;
    return `${mins} minutos`;
  }

  function abrirAgendamento(servico) {
    setServicoSelecionado(servico);
    setMensagem("");
    setErroAgendamento("");

    // Se o usuário estiver logado, preenche automaticamente o nome único da conta dele
    if (usuarioLogado) {
      const nomeConta =
        usuarioLogado.user_metadata?.nome_completo ||
        usuarioLogado.email.split("@")[0];
      setNomeTutor(nomeConta);
    }
  }

  function fecharAgendamento() {
    setServicoSelecionado(null);
    setMensagem("");
    setErroAgendamento("");
    setTelefone("");
    setNomePet("");
    setTipoAtendimento("levar");
    setEndereco("");
    setData("");
    setHorario("");
  }

  async function enviarAgendamento(event) {
    event.preventDefault();
    if (!servicoSelecionado || !usuarioLogado) return;

    setEnviando(true);
    setErroAgendamento("");

    const petNormalizado = nomePet.trim().toLowerCase();

    // 1. Verificar duplicidade: impede agendar o mesmo serviço para o mesmo pet no mesmo dia
    const { data: existentes, error: erroConsulta } = await supabase
      .from("agendamentos")
      .select("id, nome_pet, data_hora, servico_id, status")
      .eq("servico_id", servicoSelecionado.id)
      .gte("data_hora", `${data}T00:00:00`)
      .lte("data_hora", `${data}T23:59:59`);

    if (!erroConsulta && existentes && existentes.length > 0) {
      const jaAgendado = existentes.some(
        (item) =>
          item.nome_pet?.trim().toLowerCase() === petNormalizado &&
          item.status !== "cancelado"
      );

      if (jaAgendado) {
        setEnviando(false);
        setErroAgendamento(
          `O pet "${nomePet}" já possui um agendamento de ${servicoSelecionado.nome} para o dia ${data
            .split("-")
            .reverse()
            .join("/")}. Não é permitido duplicar o mesmo serviço no mesmo dia.`
        );
        return;
      }
    }

    // 2. Salvar no Supabase vinculado ao tutor único
    const dataHoraFormatada = `${data}T${horario}:00`;

    const dadosEnvio = {
      servico_id: servicoSelecionado.id,
      data_hora: dataHoraFormatada,
      nome_tutor: nomeTutor,
      telefone: telefone,
      nome_pet: nomePet.trim(),
      horario: horario,
      tipo_atendimento: tipoAtendimento,
      endereco: tipoAtendimento === "buscar" ? endereco : "Cliente levará na loja",
      status: "pendente",
    };

    const { error } = await supabase.from("agendamentos").insert([dadosEnvio]);

    setEnviando(false);

    if (error) {
      console.error("Erro ao salvar agendamento:", error);
      setErroAgendamento("Não foi possível salvar o agendamento. Tente novamente!");
    } else {
      setMensagem(
        `Agendamento confirmado! ${nomeTutor}, reservamos o serviço de ${servicoSelecionado.nome} para o pet ${nomePet} (${data.split("-").reverse().join("/")} às ${horario}). ${
          tipoAtendimento === "buscar"
            ? "Nossa equipe irá buscar em seu endereço."
            : "Você levará o pet até nossa loja."
        }`
      );
    }
  }

  return (
    <>
      <Header />

      <main className="pagina-servicos">
        <section className="servicos-intro">
          <span className="servicos-etiqueta">Cuidado e carinho em cada detalhe</span>
          <h1>Nossos serviços</h1>
          <p>Conheça nossos cuidados especiais e escolha o que seu melhor amigo precisa.</p>
        </section>

        {carregando ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>Carregando serviços disponíveis...</p>
        ) : (
          <section className="servicos-lista">
            {servicos.map((servico) => (
              <article className="servico-card" key={servico.id}>
                <div className="servico-icone">
                  <IconeServico tipo={descobrirIcone(servico.nome)} />
                </div>

                <h2>{servico.nome}</h2>
                <p className="servico-descricao">{servico.descricao}</p>
                <p className="servico-duracao">
                  <strong>Duração estimada:</strong> {formatarDuracao(servico.duracao_minutos)}
                </p>
                <p className="servico-preco">
                  R$ {Number(servico.preco).toFixed(2).replace(".", ",")}
                </p>

                <button className="botao-agendar" onClick={() => abrirAgendamento(servico)}>
                  Agendar agora
                </button>
              </article>
            ))}
          </section>
        )}
      </main>

      {servicoSelecionado && (
        <div className="modal-fundo" onClick={fecharAgendamento}>
          <section
            className="modal-agendamento"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-agendamento"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="botao-fechar"
              onClick={fecharAgendamento}
              aria-label="Fechar formulário"
            >
              ×
            </button>

            <h2 id="titulo-agendamento">Solicitar agendamento</h2>
            <p>
              Serviço escolhido: <strong>{servicoSelecionado.nome}</strong>
            </p>

            {/* Trava de Segurança: exige conta única logada */}
            {!usuarioLogado ? (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "1.2rem",
                  borderRadius: "10px",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginBottom: "0.5rem" }}>🔒 Login necessário</h3>
                <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
                  Para evitar agendamentos duplicados e garantir seu histórico, entre na sua conta antes de agendar.
                </p>
                <Link
                  to="/entrar"
                  className="botao-agendar"
                  style={{ display: "inline-block", textDecoration: "none" }}
                >
                  Entrar ou Criar Conta
                </Link>
              </div>
            ) : mensagem ? (
              <div className="mensagem-sucesso" role="status">
                <h3>
                  <IconeServico tipo="patas" tamanho={22} /> Tudo certo!
                </h3>
                <p>{mensagem}</p>
                <button type="button" className="botao-agendar" onClick={fecharAgendamento}>
                  Fechar
                </button>
              </div>
            ) : (
              <form className="form-agendamento" onSubmit={enviarAgendamento}>
                {erroAgendamento && (
                  <div
                    role="alert"
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    ⚠️ {erroAgendamento}
                  </div>
                )}

                <label htmlFor="nome-tutor">Tutor (Conta vinculada)</label>
                <input
                  id="nome-tutor"
                  type="text"
                  value={nomeTutor}
                  readOnly
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                />

                <label htmlFor="telefone">Número de telefone / WhatsApp</label>
                <input
                  id="telefone"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />

                <label htmlFor="nome-pet">Nome do pet</label>
                <input
                  id="nome-pet"
                  type="text"
                  value={nomePet}
                  onChange={(e) => setNomePet(e.target.value)}
                  placeholder="Digite o nome do seu pet"
                  required
                />

                <label>Como prefere realizar o atendimento?</label>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <label style={{ cursor: "pointer", fontWeight: "normal" }}>
                    <input
                      type="radio"
                      name="tipoAtendimento"
                      value="levar"
                      checked={tipoAtendimento === "levar"}
                      onChange={(e) => setTipoAtendimento(e.target.value)}
                    />{" "}
                    Vou levar na loja
                  </label>

                  <label style={{ cursor: "pointer", fontWeight: "normal" }}>
                    <input
                      type="radio"
                      name="tipoAtendimento"
                      value="buscar"
                      checked={tipoAtendimento === "buscar"}
                      onChange={(e) => setTipoAtendimento(e.target.value)}
                    />{" "}
                    Quero que busque em casa
                  </label>
                </div>

                {tipoAtendimento === "buscar" && (
                  <>
                    <label htmlFor="endereco">Endereço completo (Rua, Número, Bairro)</label>
                    <input
                      id="endereco"
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Ex: Rua das Flores, 123 - Centro"
                      required={tipoAtendimento === "buscar"}
                    />
                  </>
                )}

                <label htmlFor="data-agendamento">Data desejada</label>
                <input
                  id="data-agendamento"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                />

                <label htmlFor="horario-agendamento">Horário desejado</label>
                <select
                  id="horario-agendamento"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
                >
                  <option value="">Selecione um horário</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>

                <button type="submit" className="botao-agendar" disabled={enviando}>
                  {enviando ? "Verificando e salvando..." : "Enviar solicitação"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Servicos;