import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Contato.css";

function Contato() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
  };

  return (
    <>
      <Header />

      <main className="pagina-contato">
        <section className="contato-intro">
          <span className="contato-etiqueta">Fale Conosco</span>
          <h1>Estamos prontos para atentar o seu pet</h1>
          <p>
            Dúvidas, agendamentos ou informações? Entre em contacto conosco ou envie uma mensagem abaixo.
          </p>
        </section>

        <section className="contato-conteudo">
          {/* Informações de Contacto */}
          <div className="contato-info">
            <h2>Nossos Contactos</h2>
            
            <div className="info-card">
              <div className="info-icone">📍</div>
              <div>
                <h3>Localização</h3>
                <p>Cacoal - RO</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">📞</div>
              <div>
                <h3>Telefone / WhatsApp</h3>
                <p>(69) 99999-8888</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">✉️</div>
              <div>
                <h3>E-mail</h3>
                <p>contato@petcare.com.br</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">⏰</div>
              <div>
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta: 08:00 - 18:00</p>
                <p>Sábado: 08:00 - 12:00</p>
              </div>
            </div>
          </div>

          {/* Formulário de Contacto */}
          <form className="contato-formulario" onSubmit={handleSubmit}>
            <h2>Envie uma Mensagem</h2>

            <div className="campo-grupo">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                placeholder="(69) 99999-9999"
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                rows="5"
                placeholder="Como podemos ajudar você e seu pet?"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-enviar">
              Enviar Mensagem
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contato;