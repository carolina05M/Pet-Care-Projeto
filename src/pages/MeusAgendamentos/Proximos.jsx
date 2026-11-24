import { listarAgendamentosAtivos } from "../../services/agendamentosService";
import ListaAgendamentos from "./ListaAgendamentos";

function Proximos() {
  return (
    <ListaAgendamentos
      consulta={listarAgendamentosAtivos}
      mensagemVazio="Você não tem agendamentos pendentes ou confirmados."
      permitirCancelar
    />
  );
}

export default Proximos;
