import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Servicos.css";

const servicos = [
  {
    id: 1,
    nome: "Banho",
    descricao:
      "Um banho relaxante com produtos adequados para deixar seu pet limpo e cheiroso.",
    preco: 50,
    icone: "banho",
    duracao: "1 hora",
  },
  {
    id: 2,
    nome: "Banho e tosa",
    descricao:
      "Banho completo e tosa para manter a pelagem do seu pet bonita e confortável.",
    preco: 85,
    icone: "tesoura",
    duracao: "2 horas",
  },
  {
    id: 3,
    nome: "Corte de unhas",
    descricao:
      "Cuidado delicado para manter as unhas do seu companheiro aparadas.",
    preco: 25,
    icone: "patas",
    duracao: "30 minutos",
  },
  {
    id: 4,
    nome: "Hidratação",
    descricao:
      "Um cuidado especial para ajudar a manter a pelagem macia e bem tratada.",
    preco: 40,
    icone: "hidratacao",
    duracao: "45 minutos",
  },
  {
    id: 5,
    nome: "Escovação",
    descricao:
      "Escovação para remover pelos soltos e ajudar a desembaraçar a pelagem.",
    preco: 30,
    icone: "escovacao",
    duracao: "30 minutos",
  },
  {
    id: 6,
    nome: "Dia de cuidados",
    descricao:
      "Uma combinação de cuidados de higiene para seu pet aproveitar um momento especial.",
    preco: 100,
    icone: "coracao",
    duracao: "2 horas e 30 minutos",
  },
];

function IconeServico({ tipo, tamanho = 32 }) {
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
        <ellipse
          cx="5.5"
          cy="10"
          rx="2"
          ry="3"
          transform="rotate(-25 5.5 10)"
        />
        <ellipse cx="10" cy="6.5" rx="2" ry="3" />
        <ellipse cx="15" cy="6.5" rx="2" ry="3" />
        <ellipse
          cx="18.5"
          cy="10"
          rx="2"
          ry="3"
          transform="rotate(25 18.5 10)"
        />
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
      {icones[tipo]}
    </svg>
  );
}

function Servicos() {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [nomeTutor, setNomeTutor] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");

  function abrirAgendamento(servico) {
    setServicoSelecionado(servico);
    setMensagem("");
  }

  function fecharAgendamento() {
    setServicoSelecionado(null);
    setMensagem("");
  }

  function enviarAgendamento(event) {
    event.preventDefault();

    if (!servicoSelecionado) {
      return;
    }

    setMensagem(
      `Solicitação demonstrativa recebida! ${nomeTutor}, você selecionou ${servicoSelecionado.nome} para o pet ${nomePet}, em ${data}, às ${horario}.`
    );
  }

  return (
    <>
      <Header />

      <main className="pagina-servicos">
        <section className="servicos-intro">
          <span className="servicos-etiqueta">
            Cuidado e carinho em cada detalhe
          </span>

          <h1>Nossos serviços</h1>

          <p>
            Conheça nossos cuidados especiais e escolha
            o que seu melhor amigo precisa.
          </p>
        </section>

        <section className="servicos-lista">
          {servicos.map((servico) => (
            <article className="servico-card" key={servico.id}>
              <div className="servico-icone">
                <IconeServico tipo={servico.icone} />
              </div>

              <h2>{servico.nome}</h2>

              <p className="servico-descricao">
                {servico.descricao}
              </p>

              <p className="servico-duracao">
                <strong>Duração estimada:</strong> {servico.duracao}
              </p>

              <p className="servico-preco">
                R$ {servico.preco.toFixed(2).replace(".", ",")}
              </p>

              <button
                className="botao-agendar"
                onClick={() => abrirAgendamento(servico)}
              >
                Agendar agora
              </button>
            </article>
          ))}
        </section>

        <section className="servicos-aviso">
          <h2>Tem dúvidas sobre nossos serviços?</h2>
          <p>
            Entre em contato com nossa equipe para saber
            mais sobre os cuidados oferecidos.
          </p>
        </section>
      </main>

      {servicoSelecionado && (
        <div
          className="modal-fundo"
          onClick={fecharAgendamento}
        >
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

            <h2 id="titulo-agendamento">
              Solicitar agendamento
            </h2>

            <p>
              Serviço escolhido:{" "}
              <strong>{servicoSelecionado.nome}</strong>
            </p>

            {mensagem ? (
              <div className="mensagem-sucesso" role="status">
                <h3>
                  <IconeServico tipo="patas" tamanho={22} />
                  {" "}Tudo certo!
                </h3>

                <p>{mensagem}</p>

                <p>
                  Esta é apenas uma demonstração. Seu
                  agendamento ainda não foi salvo.
                </p>

                <button
                  type="button"
                  className="botao-agendar"
                  onClick={fecharAgendamento}
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form
                className="form-agendamento"
                onSubmit={enviarAgendamento}
              >
                <label htmlFor="nome-tutor">
                  Nome do tutor
                </label>
                <input
                  id="nome-tutor"
                  type="text"
                  value={nomeTutor}
                  onChange={(event) =>
                    setNomeTutor(event.target.value)
                  }
                  placeholder="Digite seu nome"
                  required
                />

                <label htmlFor="nome-pet">
                  Nome do pet
                </label>
                <input
                  id="nome-pet"
                  type="text"
                  value={nomePet}
                  onChange={(event) =>
                    setNomePet(event.target.value)
                  }
                  placeholder="Digite o nome do seu pet"
                  required
                />

                <label htmlFor="data-agendamento">
                  Data desejada
                </label>
                <input
                  id="data-agendamento"
                  type="date"
                  value={data}
                  onChange={(event) =>
                    setData(event.target.value)
                  }
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                />

                <label htmlFor="horario-agendamento">
                  Horário desejado
                </label>
                <select
                  id="horario-agendamento"
                  value={horario}
                  onChange={(event) =>
                    setHorario(event.target.value)
                  }
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

                <button
                  type="submit"
                  className="botao-agendar"
                >
                  Enviar solicitação
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