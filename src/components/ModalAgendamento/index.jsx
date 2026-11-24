import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import EstadoConsulta from "../EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { listarMeusPets } from "../../services/petsService";
import { criarAgendamento } from "../../services/agendamentosService";
import "./ModalAgendamento.css";

const HORARIOS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

// Formulário em si: só é montado com usuário logado, para carregar os pets dele.
function FormularioAgendamento({ servico, aoConcluir, aoFechar }) {
  const pets = useConsulta(listarMeusPets);

  const [petId, setPetId] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await criarAgendamento({
        petId,
        servicoId: servico.id,
        data,
        horario,
        observacoes,
      });
      aoConcluir();
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!pets.carregando && !pets.erro && pets.dados?.length === 0) {
    return (
      <div className="modal-aviso">
        <p>Você ainda não cadastrou nenhum pet. Cadastre um para agendar.</p>
        <Link to="/meus-pets" className="botao-agendar modal-link">
          Cadastrar meu pet
        </Link>
      </div>
    );
  }

  return (
    <EstadoConsulta
      carregando={pets.carregando}
      erro={pets.erro}
      onTentarNovamente={pets.recarregar}
    >
      <form className="form-agendamento" onSubmit={enviar}>
        {erro && (
          <p className="modal-erro" role="alert">
            {erro}
          </p>
        )}

        <label htmlFor="pet-agendamento">Seu pet</label>
        <select
          id="pet-agendamento"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
        >
          <option value="">Selecione um pet</option>
          {pets.dados?.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.nome}
            </option>
          ))}
        </select>

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
          {HORARIOS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <label htmlFor="obs-agendamento">Observações (opcional)</label>
        <textarea
          id="obs-agendamento"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Alguma informação importante sobre o pet?"
        />

        <button type="submit" className="botao-agendar" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar solicitação"}
        </button>
        <button type="button" className="modal-cancelar" onClick={aoFechar}>
          Cancelar
        </button>
      </form>
    </EstadoConsulta>
  );
}

function ModalAgendamento({ servico, aoFechar }) {
  const { user } = useAuth();
  const local = useLocation();
  const [concluido, setConcluido] = useState(false);

  // Fecha com a tecla Esc
  useEffect(() => {
    function aoPressionar(evento) {
      if (evento.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", aoPressionar);
    return () => document.removeEventListener("keydown", aoPressionar);
  }, [aoFechar]);

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <section
        className="modal-agendamento"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-agendamento"
        onClick={(evento) => evento.stopPropagation()}
      >
        <button
          type="button"
          className="botao-fechar"
          onClick={aoFechar}
          aria-label="Fechar formulário"
        >
          ×
        </button>

        <h2 id="titulo-agendamento">Solicitar agendamento</h2>

        <p>
          Serviço escolhido: <strong>{servico.nome}</strong>
        </p>

        {concluido ? (
          <div className="mensagem-sucesso" role="status">
            <h3>Solicitação enviada!</h3>
            <p>
              Seu agendamento está <strong>pendente</strong> e será confirmado
              pela nossa equipe. Você pode acompanhar em &ldquo;Meus
              agendamentos&rdquo;.
            </p>
            <Link to="/meus-agendamentos" className="botao-agendar modal-link">
              Ver meus agendamentos
            </Link>
          </div>
        ) : !user ? (
          <div className="modal-aviso">
            <p>Para agendar, entre na sua conta ou crie uma gratuitamente.</p>
            <Link
              to="/entrar"
              state={{ de: local }}
              className="botao-agendar modal-link"
            >
              Entrar ou cadastrar
            </Link>
          </div>
        ) : (
          <FormularioAgendamento
            servico={servico}
            aoConcluir={() => setConcluido(true)}
            aoFechar={aoFechar}
          />
        )}
      </section>
    </div>
  );
}

export default ModalAgendamento;
