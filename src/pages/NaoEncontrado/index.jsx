import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./NaoEncontrado.css";

function NaoEncontrado() {
  return (
    <>
      <Header />
      <main className="pagina-404">
        <div>
          <h1>Página não encontrada</h1>
          <p>O endereço que você tentou abrir não existe.</p>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NaoEncontrado;