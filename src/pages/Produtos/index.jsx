import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Produtos.css";

function IconeProduto({ tipo = "racao", tamanho = 48 }) {
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
      {icones[tipo] || icones.racao}
    </svg>
  );
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  
  const [quantidadesSelecionadas, setQuantidadesSelecionadas] = useState({});
  const [carrinho, setCarrinho] = useState([]);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);

  // Campos para a entrega
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      const { data, error } = await supabase.from("produtos").select("*");

      if (error) {
        console.error("Erro ao buscar produtos:", error);
      } else if (data) {
        setProdutos(data);
        const qtdsIniciais = {};
        data.forEach((p) => {
          qtdsIniciais[p.id] = 1;
        });
        setQuantidadesSelecionadas(qtdsIniciais);
      }
      setCarregando(false);
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    return produto.nome.toLowerCase().includes(busca.toLowerCase());
  });

  function descobrirIcone(nome) {
    const n = nome.toLowerCase();
    if (n.includes("ração") || n.includes("racao")) return "racao";
    if (n.includes("mordedor") || n.includes("brinquedo")) return "mordedor";
    if (n.includes("caminha") || n.includes("cama")) return "caminha";
    if (n.includes("shampoo") || n.includes("banho")) return "shampoo";
    return "racao";
  }

  function alterarQtdCard(produtoId, valor) {
    setQuantidadesSelecionadas((atual) => {
      const atualQtd = atual[produtoId] || 1;
      const novaQtd = atualQtd + valor;
      return { ...atual, [produtoId]: novaQtd > 0 ? novaQtd : 1 };
    });
  }

  function adicionarAoCarrinho(produto) {
    const qtdParaAdicionar = quantidadesSelecionadas[produto.id] || 1;

    setCarrinho((carrinhoAtual) => {
      const indexExistente = carrinhoAtual.findIndex((item) => item.produto.id === produto.id);
      if (indexExistente >= 0) {
        const novoCarrinho = [...carrinhoAtual];
        novoCarrinho[indexExistente].quantidade += qtdParaAdicionar;
        return novoCarrinho;
      } else {
        return [...carrinhoAtual, { produto, quantidade: qtdParaAdicionar }];
      }
    });

    alert(`${qtdParaAdicionar}x "${produto.nome}" adicionado(s) ao carrinho!`);
  }

  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const valorTotalCarrinho = carrinho.reduce(
    (acc, item) => acc + Number(item.produto.preco) * item.quantidade,
    0
  );

  function finalizarPedido(e) {
    e.preventDefault();
    if (!nomeCliente || !telefone || !enderecoEntrega) {
      alert("Por favor, preencha todos os dados de entrega.");
      return;
    }
    setPedidoFinalizado(true);
  }

  function fecharModal() {
    setModalCarrinhoAberto(false);
    if (pedidoFinalizado) {
      setCarrinho([]);
      setPedidoFinalizado(false);
      setNomeCliente("");
      setTelefone("");
      setEnderecoEntrega("");
    }
  }

  return (
    <>
      <Header />

      <main className="pagina-produtos">
        <section className="produtos-intro">
          <span className="produtos-etiqueta">Tudo para seu melhor amigo</span>
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

            <button
              type="button"
              className="produtos-carrinho"
              onClick={() => setModalCarrinhoAberto(true)}
            >
              <IconeProduto tipo="carrinho" tamanho={20} />
              Carrinho: <strong>{totalItensCarrinho}</strong>
            </button>
          </div>

          <div className="produtos-controles">
            <input
              type="search"
              placeholder="Buscar produto..."
              aria-label="Buscar produto"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          {carregando ? (
            <p className="produtos-vazio">Carregando produtos da loja...</p>
          ) : produtosFiltrados.length > 0 ? (
            <div className="produtos-lista">
              {produtosFiltrados.map((produto) => {
                const qtdAtual = quantidadesSelecionadas[produto.id] || 1;
                return (
                  <article className="produto-card" key={produto.id}>
                    <div className="produto-imagem" aria-hidden="true">
                      <IconeProduto tipo={descobrirIcone(produto.nome)} tamanho={56} />
                    </div>

                    <div className="produto-informacoes">
                      <h3>{produto.nome}</h3>
                      <p>{produto.descricao}</p>

                      <div className="produto-rodape">
                        <strong>
                          {Number(produto.preco).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </strong>

                        <div className="acoes-produto">
                          <div className="seletor-quantidade">
                            <button
                              type="button"
                              onClick={() => alterarQtdCard(produto.id, -1)}
                            >
                              -
                            </button>
                            <span>{qtdAtual}</span>
                            <button
                              type="button"
                              onClick={() => alterarQtdCard(produto.id, 1)}
                            >
                              +
                            </button>
                          </div>

                          <button type="button" className="btn-adicionar" onClick={() => adicionarAoCarrinho(produto)}>
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="produtos-vazio">
              Nenhum produto cadastrado no banco de dados ainda.
            </p>
          )}
        </section>
      </main>

      {/* Modal do Carrinho com Endereço de Entrega */}
      {modalCarrinhoAberto && (
        <div className="modal-fundo" onClick={fecharModal}>
          <div className="modal-agendamento" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="botao-fechar"
              onClick={fecharModal}
            >
              ×
            </button>

            <h2>🛒 Seu Carrinho PetCare</h2>

            {pedidoFinalizado ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <h3 style={{ color: "#16a34a", marginBottom: "1rem" }}>🐾 Pedido Realizado com Sucesso!</h3>
                <p style={{ marginBottom: "1rem" }}>
                  Obrigado, <strong>{nomeCliente}</strong>! Seus produtos serão entregues em:
                </p>
                <p style={{ fontStyle: "italic", marginBottom: "1.5rem", color: "#555" }}>
                  📍 {enderecoEntrega}
                </p>
                <button
                  type="button"
                  className="botao-agendar"
                  style={{ width: "100%", padding: "12px", cursor: "pointer" }}
                  onClick={fecharModal}
                >
                  Concluir
                </button>
              </div>
            ) : carrinho.length === 0 ? (
              <p style={{ margin: "2rem 0", textAlign: "center", color: "#666" }}>
                O seu carrinho está vazio. Adicione produtos para continuar!
              </p>
            ) : (
              <>
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
                  {carrinho.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        padding: "8px 0",
                      }}
                    >
                      <div>
                        <strong>{item.produto.nome}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          Qtd: {item.quantidade} x R${Number(item.produto.preco).toFixed(2).replace(".", ",")}
                        </small>
                      </div>
                      <span style={{ fontWeight: "bold", color: "#4a3b32" }}>
                        R$ {(Number(item.produto.preco) * item.quantidade).toFixed(2).replace(".", ",")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.05rem",
                    fontWeight: "bold",
                    margin: "1rem 0",
                    borderTop: "2px solid #ddd",
                    paddingTop: "0.8rem",
                  }}
                >
                  <span>Total da Compra:</span>
                  <span style={{ color: "#16a34a" }}>
                    {valorTotalCarrinho.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>

                <form onSubmit={finalizarPedido} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 style={{ fontSize: "1rem", marginTop: "0.5rem", color: "#4a3b32" }}>Dados para Entrega</h3>
                  
                  <label htmlFor="nome-cliente" style={{ fontSize: "0.9rem" }}>Nome Completo</label>
                  <input
                    id="nome-cliente"
                    type="text"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Seu nome"
                    required
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />

                  <label htmlFor="tel-cliente" style={{ fontSize: "0.9rem" }}>Telefone / WhatsApp</label>
                  <input
                    id="tel-cliente"
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />

                  <label htmlFor="end-cliente" style={{ fontSize: "0.9rem" }}>Endereço Completo de Entrega</label>
                  <textarea
                    id="end-cliente"
                    rows="2"
                    value={enderecoEntrega}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                    placeholder="Rua, Número, Bairro, Cidade - Estado"
                    required
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", resize: "none" }}
                  />

                  <button
                    type="submit"
                    className="botao-agendar"
                    style={{ width: "100%", padding: "12px", cursor: "pointer", marginTop: "5px" }}
                  >
                    Confirmar Pedido com Entrega
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Produtos;