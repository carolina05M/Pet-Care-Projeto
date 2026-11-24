import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useConsulta } from "../../hooks/useConsulta";
import { buscarProduto } from "../../services/produtosService";
import { formatarPreco } from "../../utils/formatadores";
import styles from "../Detalhe.module.css";

function DetalheProduto() {
  const { id } = useParams();
  const consulta = useCallback(() => buscarProduto(id), [id]);
  const { dados: produto, carregando, erro, recarregar } = useConsulta(consulta);

  return (
    <>
      <Header />

      <main className={styles.pagina}>
        <Link to="/produtos" className={styles.voltar}>
          ← Voltar para produtos
        </Link>

        <EstadoConsulta
          carregando={carregando}
          erro={erro}
          vazio={!produto}
          mensagemVazio="Produto não encontrado ou indisponível."
          onTentarNovamente={recarregar}
        >
          {produto && (
            <article className={styles.cartao}>
              <span className={styles.etiqueta}>
                {produto.categorias?.nome ?? "Sem categoria"}
              </span>
              <h1>{produto.nome}</h1>
              <p className={styles.descricao}>
                {produto.descricao || "Sem descrição cadastrada."}
              </p>

              <dl className={styles.dados}>
                <div>
                  <dt>Preço</dt>
                  <dd>{formatarPreco(produto.preco)}</dd>
                </div>
                <div>
                  <dt>Disponibilidade</dt>
                  <dd>
                    {produto.estoque > 0
                      ? `Em estoque (${produto.estoque})`
                      : "Indisponível no momento"}
                  </dd>
                </div>
              </dl>

              <Link to="/produtos" className={styles.acao}>
                Ver todos os produtos
              </Link>
            </article>
          )}
        </EstadoConsulta>
      </main>

      <Footer />
    </>
  );
}

export default DetalheProduto;
