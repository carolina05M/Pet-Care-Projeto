import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { carregarDashboard } from "../../services/dashboardService";
import { formatarPreco } from "../../utils/formatadores";

function Dashboard() {
  const { dados, carregando, erro, recarregar } = useConsulta(carregarDashboard);

  const maiorValor = Math.max(1, ...(dados?.semana.map((d) => d.valor) ?? [1]));

  return (
    <EstadoConsulta carregando={carregando} erro={erro} onTentarNovamente={recarregar}>
      {dados && (
        <>
          <section className="administrador-indicadores">
            <article className="administrador-card">
              <span>👥</span>
              <p>Clientes ativos</p>
              <h2>{dados.clientes}</h2>
            </article>

            <article className="administrador-card">
              <span>📅</span>
              <p>Agendamentos hoje</p>
              <h2>{dados.agendamentosHoje}</h2>
              <small>{dados.pendentes} pendente(s) no total</small>
            </article>

            <article className="administrador-card">
              <span>💰</span>
              <p>Receita do mês</p>
              <h2>{formatarPreco(dados.receitaMes)}</h2>
              <small>Serviços concluídos</small>
            </article>

            <article className="administrador-card">
              <span>🐾</span>
              <p>Pets cadastrados</p>
              <h2>{dados.pets}</h2>
            </article>
          </section>

          <section className="administrador-painel">
            <h2>Agendamentos da semana</h2>

            <div className="administrador-grafico">
              {dados.semana.map((item) => (
                <div className="administrador-barra-item" key={item.dia}>
                  <span>{item.valor}</span>
                  <div
                    className="administrador-barra"
                    style={{ height: `${(item.valor / maiorValor) * 150}px` }}
                  />
                  <small>{item.dia}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="administrador-painel">
            <h2>Pendências</h2>
            <p>
              {dados.pendentes} agendamento(s) aguardando confirmação e{" "}
              {dados.mensagensNaoLidas} mensagem(ns) não lida(s).
            </p>
          </section>
        </>
      )}
    </EstadoConsulta>
  );
}

export default Dashboard;
