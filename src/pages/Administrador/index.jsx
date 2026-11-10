
import "./Administrador.css";

function Administrador() {
  return (
    <div className="administrador-layout">
      <aside className="administrador-sidebar">
        <div className="administrador-logo">
          <span>🐾</span>
          <h2>PetCare</h2>
          <p>Painel Administrativo</p>
        </div>

        <nav className="administrador-menu">
          <a href="#inicio">🏠 Início</a>
          <a href="#agendamentos">📅 Agendamentos</a>
          <a href="#servicos">✂️ Serviços</a>
          <a href="#produtos">🛍️ Produtos</a>
          <a href="#categorias">🏷️ Categorias</a>
          <a href="#clientes">👥 Clientes</a>
          <a href="#pets">🐾 Pets</a>
          <a href="#mensagens">✉️ Mensagens</a>
        </nav>
      </aside>

      <main className="administrador-conteudo" id="inicio">
        <header className="administrador-cabecalho">
          <h1>Administrador</h1>
          <a href="/">← Voltar ao PetCare</a>
        </header>

        <section className="administrador-indicadores">
          <article className="administrador-card">
            <span>👥</span>
            <p>Clientes ativos</p>
            <h2>2.143</h2>
            <small>+12%</small>
          </article>

          <article className="administrador-card">
            <span>📅</span>
            <p>Agendamentos hoje</p>
            <h2>23</h2>
            <small>+5</small>
          </article>

          <article className="administrador-card">
            <span>💰</span>
            <p>Receita do mês</p>
            <h2>R$ 18,9 mil</h2>
            <small>+8%</small>
          </article>

          <article className="administrador-card">
            <span>🐾</span>
            <p>Pets cadastrados</p>
            <h2>3.891</h2>
            <small>+47</small>
          </article>
        </section>

        <section className="administrador-painel" id="agendamentos">
          <h2>Agendamentos da semana</h2>

          <div className="administrador-grafico">
            {[
              { dia: "Seg", valor: 8 },
              { dia: "Ter", valor: 12 },
              { dia: "Qua", valor: 6 },
              { dia: "Qui", valor: 15 },
              { dia: "Sex", valor: 10 },
              { dia: "Sáb", valor: 18 },
              { dia: "Dom", valor: 4 },
            ].map((item) => (
              <div className="administrador-barra-item" key={item.dia}>
                <span>{item.valor}</span>
                <div
                  className="administrador-barra"
                  style={{ height: `${item.valor * 8}px` }}
                />
                <small>{item.dia}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="administrador-painel" id="clientes">
          <h2>Atividade administrativa</h2>
          <p>Bem-vindo ao painel administrativo do PetCare.</p>
          <p>
            Aqui você poderá acompanhar clientes, pets, serviços,
            produtos e agendamentos.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Administrador;
