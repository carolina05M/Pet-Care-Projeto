import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EstadoConsulta from "../../components/EstadoConsulta";
import ModalAgendamento from "../../components/ModalAgendamento";
import { useConsulta } from "../../hooks/useConsulta";
import { listarServicos } from "../../services/servicosService";
import { formatarDuracao, formatarPreco } from "../../utils/formatadores";
import "./Servicos.css";

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

  // Ícone desconhecido ou nulo no banco: usa o coração
  const conteudo = icones[tipo] ?? icones.coracao;

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
      {conteudo}
    </svg>
  );
}

function Servicos() {
  const {
    dados: servicos,
    carregando,
    erro,
    recarregar,
  } = useConsulta(listarServicos);

  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  function abrirAgendamento(servico) {
    setServicoSelecionado(servico);
  }

  function fecharAgendamento() {
    setServicoSelecionado(null);
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

        <EstadoConsulta
          carregando={carregando}
          erro={erro}
          vazio={servicos?.length === 0}
          mensagemVazio="Nenhum serviço disponível no momento."
          onTentarNovamente={recarregar}
        >
          <section className="servicos-lista">
            {servicos?.map((servico) => (
              <article className="servico-card" key={servico.id}>
                <div className="servico-icone">
                  <IconeServico tipo={servico.icone} />
                </div>

                <h2>{servico.nome}</h2>

                <p className="servico-descricao">{servico.descricao}</p>

                <p className="servico-duracao">
                  <strong>Duração estimada:</strong>{" "}
                  {formatarDuracao(servico.duracao_minutos)}
                </p>

                <p className="servico-preco">{formatarPreco(servico.preco)}</p>

                <Link
                  to={`/servicos/${servico.id}`}
                  className="link-detalhes"
                >
                  Ver detalhes
                </Link>

                <button
                  className="botao-agendar"
                  onClick={() => abrirAgendamento(servico)}
                >
                  Agendar agora
                </button>
              </article>
            ))}
          </section>
        </EstadoConsulta>

        <section className="servicos-aviso">
          <h2>Tem dúvidas sobre nossos serviços?</h2>
          <p>
            Entre em contato com nossa equipe para saber
            mais sobre os cuidados oferecidos.
          </p>
        </section>
      </main>

      {servicoSelecionado && (
        <ModalAgendamento
          servico={servicoSelecionado}
          aoFechar={fecharAgendamento}
        />
      )}

      <Footer />
    </>
  );
}

export default Servicos;