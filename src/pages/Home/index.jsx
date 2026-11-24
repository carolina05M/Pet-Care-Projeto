import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  return (
    <>
      <Header />
      <section className="container">
        <div className="apresentacao">

          <p>Bem vindo ao PetCare,
            onde o cuidado é a nossa prioridade.
          </p>
          <Link to="/servicos"> Conheça os nossos serviços</Link>

        </div>
        <figure>
          <img
            className="img-home"
            src="/golden-home.svg.jpg"
            alt="Cachorro golden retriever olhando para a câmera"
            width="600"
            height="700"
            fetchPriority="high"
          />
        </figure>
      </section>
      <Footer />
    </>
  )
}

export default Home