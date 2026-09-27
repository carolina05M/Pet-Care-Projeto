import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"

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
          <img className="img-home" src="golden-home.svg.jpg" alt="imagem da home" />
        </figure>
      </section>
      <Footer />
    </>
  )
}

export default Home