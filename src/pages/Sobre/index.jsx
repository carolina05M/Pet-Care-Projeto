import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Sobre.css";

function Sobre() {
  return (
    <>
      <Header />

      <main className="pagina-sobre">
        <section className="sobre-intro">
          <span className="sobre-etiqueta">
            Conheça o PetCare
          </span>

          <h1>Nascemos do amor pelos animais</h1>

          <p>
            Mais do que cuidar de pets, queremos fazer parte da história
            de cada família, oferecendo carinho, atenção e bem-estar.
          </p>
        </section>

        <section className="sobre-historia">
          <div className="sobre-historia-texto">
            <span className="sobre-subtitulo">
              Nossa história
            </span>

            <h2>Um sonho que começou em 2017</h2>

            <p>
              O PetCare nasceu em 2017, quando a veterinária Renata Borges
              decidiu criar um espaço diferente — onde cada pet é tratado
              como família, não como cliente.
            </p>

            <p>
              Hoje somos uma equipe de mais de 15 especialistas apaixonados,
              atendendo mais de 2.000 famílias em São Paulo. Nosso compromisso
              é oferecer o mais alto padrão de cuidado veterinário e
              bem-estar animal.
            </p>
          </div>

          <div
            className="sobre-destaque"
            aria-label="PetCare desde 2017"
          >
            <div
              className="sobre-destaque-icone"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
              </svg>
            </div>

            <span>Desde</span>

            <strong>2017</strong>

            <p>
              Cuidando de quem faz parte da sua família
            </p>
          </div>
        </section>

        <section className="sobre-numeros">
          <div className="sobre-numero">
            <strong>15+</strong>
            <span>especialistas apaixonados</span>
          </div>

          <div className="sobre-numero">
            <strong>2.000+</strong>
            <span>famílias atendidas</span>
          </div>

          <div className="sobre-numero">
            <strong>2017</strong>
            <span>ano em que tudo começou</span>
          </div>
        </section>

        <section className="sobre-compromisso">
          <span className="sobre-subtitulo">
            O que nos move
          </span>

          <h2>Cuidado que vem do coração</h2>

          <p>
            Acreditamos que cada animal merece ser tratado com respeito,
            carinho e atenção. Por isso, nosso trabalho é guiado pelo amor
            aos animais e pelo compromisso com a qualidade do cuidado
            veterinário e do bem-estar.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Sobre;