import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { buscarServico } from "../../services/servicosService";
import { formatarDuracao, formatarPreco } from "../../utils/formatadores";
import styles from "../Detalhe.module.css";

function DetalheServico() {
  const { id } = useParams();
  // A função precisa ser estável entre renders; ela só muda quando o id da URL muda.
  const consulta = useCallback(() => buscarServico(id), [id]);
  const { dados: servico, carregando, erro, recarregar } = useConsulta(consulta);

  return (
    <>
      <Header />

      <main className={styles.pagina}>
        <Link to="/servicos" className={styles.voltar}>
          ← Voltar para serviços
        </Link>

        <EstadoConsulta
          carregando={carregando}
          erro={erro}
          vazio={!servico}
          mensagemVazio="Serviço não encontrado ou indisponível."
          onTentarNovamente={recarregar}
        >
          {servico && (
            <article className={styles.cartao}>
              <span className={styles.etiqueta}>Serviço</span>
              <h1>{servico.nome}</h1>
              <p className={styles.descricao}>
                {servico.descricao || "Sem descrição cadastrada."}
              </p>

              <dl className={styles.dados}>
                <div>
                  <dt>Duração estimada</dt>
                  <dd>{formatarDuracao(servico.duracao_minutos)}</dd>
                </div>
                <div>
                  <dt>Preço</dt>
                  <dd>{formatarPreco(servico.preco)}</dd>
                </div>
              </dl>

              <Link to="/servicos" className={styles.acao}>
                Ver todos os serviços
              </Link>
            </article>
          )}
        </EstadoConsulta>
      </main>

      <Footer />
    </>
  );
}

export default DetalheServico;
