import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Produtos.css";

const produtos = [
  {
    id: 1,
    nome: "Ração Premium",
    categoria: "Ração",
    descricao: "Nutrição completa para o dia a dia do seu pet.",
    preco: 89.9,
    icone: "racao",
  },
  {
    id: 2,
    nome: "Brinquedo Mordedor",
    categoria: "Brinquedos",
    descricao: "Diversão e estímulo para seu melhor amigo.",
    preco: 24.9,
    icone: "mordedor",
  },
  {
    id: 3,
    nome: "Caminha Confortável",
    categoria: "Acessórios",
    descricao: "Um cantinho macio para descansar e sonhar.",
    preco: 119.9,
    icone: "caminha",
  },
  {
    id: 4,
    nome: "Shampoo Pet",
    categoria: "Higiene",
    descricao: "Limpeza delicada para os pelos do seu pet.",
    preco: 32.5,
    icone: "shampoo",
  },
  {
    id: 5,
    nome: "Bolinha Colorida",
    categoria: "Brinquedos",
    descricao: "Ideal para brincadeiras e momentos ativos.",
    preco: 15.9,
    icone: "bolinha",
  },
  {
    id: 6,
    nome: "Coleira Ajustável",
    categoria: "Acessórios",
    descricao: "Conforto e segurança para os passeios.",
    preco: 39.9,
    icone: "coleira",
  },
];

const categorias = ["Todos", "Ração", "Brinquedos", "Acessórios", "Higiene"];

function IconeProduto({ tipo, tamanho = 48 }) {
  const icones = {
    racao: (
      <>
        <path d="M4 10h16l-1.5 10h-13L4 10Z" />
        <path d="M4 10c0-3 3.6-5 8-5s8 2 8 5" />
        <circle cx="9" cy="11" r="1" />
        <circle cx="13" cy="14" r="1" />
        <circle cx="16" cy="11" r="1" />
      </>
    ),

    mordedor: (
      <>
        <path d="M8 5c-2-2-5 0-4 3l2 3-2 3c-1 3 2 5 4 3l4-3 4 3c2 2 5 0 4-3l-2-3 2-3c1-3-2-5-4-3l-4 3-4-3Z" />
        <path d="M9 8l6 8M15 8l-6 8" />
      </>
    ),

    caminha: (
      <>
        <path d="M3 13c0-2 2-4 4-4h10c2 0 4 2 4 4v6H3v-6Z" />
        <path d="M3 15h18M7 9V6h10v3" />
        <path d="M7 19v2M17 19v2" />
        <path d="M8 13c1.5 1 6.5 1 8 0" />
      </>
    ),

    shampoo: (
      <>
        <path d="M9 3h6v3l2 2v13H7V8l2-2V3Z" />
        <path d="M9 3h6M7 10h10" />
        <path d="M12 13c-1.5 2-2 2.7-2 3.7a2 2 0 0 0 4 0c0-1-.5-1.7-2-3.7Z" />
      </>
    ),

    bolinha: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M6 5.5c3 1 4 3 3 5.5s-1 5 2 7.5" />
        <path d="M18 5.5c-3 1-4 3-3 5.5s1 5-2 7.5" />
        <path d="M3.5 10c3 1 5.5 1 8.5-1M12 15c3-2 5.5-2 8.5-1" />
      </>
    ),

    coleira: (
      <>
        <path d="M5 4c0 7 2 13 7 16 5-3 7-9 7-16" />
        <path d="M5 4c3 2 11 2 14 0" />
        <path d="M9 8h6v5H9z" />
        <path d="M12 13v3" />
      </>
    ),

    carrinho: (
      <>
        <path d="M3 4h2l2.2 11h10.9l2-8H6" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="17" cy="19" r="1.5" />
      </>
    ),
  };

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icones[tipo]}
    </svg>
  );
}

function Produtos() {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondeBusca = produto.nome
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeCategoria =
      categoriaSelecionada === "Todos" ||
      produto.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  function adicionarAoCarrinho() {
    setQuantidadeCarrinho((quantidadeAtual) => quantidadeAtual + 1);
  }

  return (
    <>
      <Header />

      <main className="pagina-produtos">
        <section className="produtos-intro">
          <span className="produtos-etiqueta">
            Tudo para seu melhor amigo
          </span>

          <h1>Nossos produtos</h1>

          <p>
            Encontre carinho em cada escolha: produtos selecionados para cuidar,
            divertir e deixar seu pet ainda mais feliz.
          </p>
        </section>

        <section className="produtos-conteudo">
          <div className="produtos-topo">
            <div>
              <span className="produtos-subtitulo">Nossa loja</span>
              <h2>Escolha o que seu pet precisa</h2>
            </div>

            <div className="produtos-carrinho" aria-live="polite">
              <IconeProduto tipo="carrinho" tamanho={20} />
              {" "}Carrinho: <strong>{quantidadeCarrinho}</strong>
            </div>
          </div>

          <div className="produtos-controles">
            <input
              type="search"
              placeholder="Buscar produto..."
              aria-label="Buscar produto"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />

            <div className="produtos-categorias">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  className={
                    categoriaSelecionada === categoria
                      ? "categoria-botao categoria-ativa"
                      : "categoria-botao"
                  }
                  onClick={() => setCategoriaSelecionada(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {produtosFiltrados.length > 0 ? (
            <div className="produtos-lista">
              {produtosFiltrados.map((produto) => (
                <article className="produto-card" key={produto.id}>
                  <div className="produto-imagem" aria-hidden="true">
                    <IconeProduto tipo={produto.icone} />
                  </div>

                  <div className="produto-informacoes">
                    <span className="produto-categoria">
                      {produto.categoria}
                    </span>

                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <div className="produto-rodape">
                      <strong>
                        {produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </strong>

                      <button
                        type="button"
                        onClick={adicionarAoCarrinho}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="produtos-vazio">
              Não encontramos produtos com esse nome ou categoria.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Produtos;