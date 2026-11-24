import { useState } from "react";
import { listarHistoricoAgendamentos } from "../../services/agendamentosService";
import ListaAgendamentos from "./ListaAgendamentos";
import styles from "../AreaCliente.module.css";

function Historico() {
  const [filtro, setFiltro] = useState("");

  return (
    <>
      <div className={styles.filtros}>
        <label htmlFor="filtro-historico">Mostrar</label>
        <select id="filtro-historico" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Concluídos e cancelados</option>
          <option value="concluido">Somente concluídos</option>
          <option value="cancelado">Somente cancelados</option>
        </select>
      </div>

      <ListaAgendamentos
        consulta={listarHistoricoAgendamentos}
        filtroStatus={filtro}
        mensagemVazio="Nada no histórico para este filtro."
      />
    </>
  );
}

export default Historico;
