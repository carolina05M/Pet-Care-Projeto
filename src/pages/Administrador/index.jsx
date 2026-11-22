import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import SidebarAdmin from "../../components/SidebarAdmin";
import "./Administrador.css";

export function Administrador() {
  const [abaAtiva, setAbaAtiva] = useState("geral");

  // Estados para Produtos
  const [nomeProd, setNomeProd] = useState("");
  const [descProd, setDescProd] = useState("");
  const [precoProd, setPrecoProd] = useState("");
  const [produtos, setProdutos] = useState([]);

  // Estados para Serviços
  const [nomeServ, setNomeServ] = useState("");
  const [precoServ, setPrecoServ] = useState("");
  const [servicos, setServicos] = useState([]);

  // Estado para Agendamentos reais do Supabase
  const [agendamentos, setAgendamentos] = useState([]);

  const [carregando, setCarregando] = useState(false);

  // Buscar Todos os Dados do Supabase em tempo real
  async function buscarDados() {
    // 1. Produtos
    const { data: resProd } = await supabase
      .from("produtos")
      .select("*")
      .order("id", { ascending: false });
    if (resProd) setProdutos(resProd);

    // 2. Serviços
    const { data: resServ } = await supabase
      .from("servicos")
      .select("*")
      .order("id", { ascending: false });
    if (resServ) setServicos(resServ);

    // 3. Agendamentos
    const { data: resAgend, error: erroAgend } = await supabase
      .from("agendamentos")
      .select("*")
      .order("id", { ascending: false });
      
    if (erroAgend) {
      console.error("Erro ao buscar agendamentos:", erroAgend.message);
    } else if (resAgend) {
      setAgendamentos(resAgend);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  // Cadastrar Produto
  async function handleCadastrarProduto(e) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await supabase
      .from("produtos")
      .insert([{ nome: nomeProd, descricao: descProd, preco: Number(precoProd) }]);
    setCarregando(false);

    if (error) {
      alert("Erro ao cadastrar produto: " + error.message);
    } else {
      alert("Produto cadastrado com sucesso!");
      setNomeProd("");
      setDescProd("");
      setPrecoProd("");
      buscarDados();
    }
  }

  // Excluir Produto
  async function handleExcluirProduto(id) {
    if (!window.confirm("Queres mesmo apagar este produto?")) return;
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (!error) buscarDados();
  }

  // Cadastrar Serviço
  async function handleCadastrarServico(e) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await supabase
      .from("servicos")
      .insert([{ nome: nomeServ, preco: Number(precoServ) }]);
    setCarregando(false);

    if (error) {
      alert("Erro ao cadastrar serviço: " + error.message);
    } else {
      alert("Serviço cadastrado com sucesso!");
      setNomeServ("");
      setPrecoServ("");
      buscarDados();
    }
  }

  // Atualizar Status ou Excluir Agendamento
  async function handleConcluirAgendamento(id) {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: "Concluído" })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar status: " + error.message);
    } else {
      buscarDados();
    }
  }

  async function handleExcluirAgendamento(id) {
    if (!window.confirm("Deseja remover este agendamento?")) return;
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (!error) buscarDados();
  }

  return (
    <div className="administrador-layout">
      <SidebarAdmin abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

      <main className="administrador-conteudo">
        <header className="administrador-cabecalho">
          <h1>Painel Administrativo — PetCare</h1>
          <Link to="/">Voltar ao site</Link>
        </header>

        {/* CONTEÚDO DA ABA: VISÃO GERAL */}
        {abaAtiva === "geral" && (
          <div>
            <h2>📊 Visão Geral do Sistema</h2>
            <section className="administrador-indicadores" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginTop: "20px" }}>
              <div className="administrador-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <span>📦</span>
                <p>Total de Produtos</p>
                <h2>{produtos.length}</h2>
              </div>
              <div className="administrador-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <span>✂️</span>
                <p>Serviços Ativos</p>
                <h2>{servicos.length}</h2>
              </div>
              <div className="administrador-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <span>📅</span>
                <p>Agendamentos</p>
                <h2>{agendamentos.length}</h2>
              </div>
              <div className="administrador-card" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <span>💬</span>
                <p>Mensagens</p>
                <h2>3</h2>
              </div>
            </section>
          </div>
        )}

        {/* CONTEÚDO DA ABA: PRODUTOS */}
        {abaAtiva === "produtos" && (
          <section className="administrador-painel">
            <h2>📦 Gerenciamento de Produtos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
              <form onSubmit={handleCadastrarProduto} style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <h3>Cadastrar Novo Produto</h3>
                <div style={{ margin: "10px 0" }}>
                  <label>Nome:</label>
                  <input type="text" value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <div style={{ margin: "10px 0" }}>
                  <label>Descrição:</label>
                  <textarea value={descProd} onChange={(e) => setDescProd(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <div style={{ margin: "10px 0" }}>
                  <label>Preço (R$):</label>
                  <input type="number" step="0.01" value={precoProd} onChange={(e) => setPrecoProd(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <button type="submit" disabled={carregando} style={{ background: "#4B2D27", color: "#fff", padding: "10px", width: "100%", border: "none", cursor: "pointer" }}>
                  {carregando ? "A salvar..." : "Salvar Produto"}
                </button>
              </form>

              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <h3>Lista de Produtos ({produtos.length})</h3>
                <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                  {produtos.map((p) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "8px 0" }}>
                      <div>
                        <strong>{p.nome}</strong> - R$ {Number(p.preco).toFixed(2)}
                      </div>
                      <button onClick={() => handleExcluirProduto(p.id)} style={{ background: "#d9534f", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>
                        Apagar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTEÚDO DA ABA: SERVIÇOS */}
        {abaAtiva === "servicos" && (
          <section className="administrador-painel">
            <h2>✂️ Gerenciamento de Serviços</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
              <form onSubmit={handleCadastrarServico} style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <h3>Cadastrar Novo Serviço</h3>
                <div style={{ margin: "10px 0" }}>
                  <label>Nome do Serviço (ex: Banho e Tosa):</label>
                  <input type="text" value={nomeServ} onChange={(e) => setNomeServ(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <div style={{ margin: "10px 0" }}>
                  <label>Preço (R$):</label>
                  <input type="number" step="0.01" value={precoServ} onChange={(e) => setPrecoServ(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <button type="submit" disabled={carregando} style={{ background: "#4B2D27", color: "#fff", padding: "10px", width: "100%", border: "none", cursor: "pointer" }}>
                  {carregando ? "A salvar..." : "Salvar Serviço"}
                </button>
              </form>

              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                <h3>Lista de Serviços ({servicos.length})</h3>
                <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                  {servicos.map((s) => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "8px 0" }}>
                      <div>
                        <strong>{s.nome}</strong> - R$ {Number(s.preco).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CONTEÚDO DA ABA: AGENDAMENTOS REAIS */}
        {abaAtiva === "agendamentos" && (
          <section className="administrador-painel" style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>📅 Gestão de Agendamentos ({agendamentos.length})</h2>
              <button onClick={buscarDados} style={{ background: "#BD835B", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
                🔄 Atualizar Lista
              </button>
            </div>

            {agendamentos.length === 0 ? (
              <p style={{ color: "#666", marginTop: "20px" }}>
                Nenhum agendamento encontrado no banco de dados ainda.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                  <tr style={{ background: "#F6F0E8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Nome do Dono / Tutor</th>
                    <th style={{ padding: "10px" }}>Pet</th>
                    <th style={{ padding: "10px" }}>Serviço</th>
                    <th style={{ padding: "10px" }}>Data / Hora</th>
                    <th style={{ padding: "10px" }}>Modalidade / Endereço</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((ag) => (
                    <tr key={ag.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>
                        <strong>
                          {ag.nome_tutor ||
                            ag.nome_dono ||
                            ag.nome_cliente ||
                            ag.tutor ||
                            ag.dono ||
                            ag.responsavel ||
                            ag.nome_completo ||
                            ag.nome ||
                            ag.cliente ||
                            "Cliente não informado"}
                        </strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>{ag.telefone || ag.contato || ag.email || ""}</div>
                      </td>
                      <td style={{ padding: "10px" }}>{ag.nome_pet || ag.pet || "—"}</td>
                      <td style={{ padding: "10px" }}>{ag.servico || ag.nome_servico || ag.tipo_servico || "—"}</td>
                      <td style={{ padding: "10px" }}>
                        {ag.data || ag.data_agendamento || ""} {ag.horario || ag.hora ? `às ${ag.horario || ag.hora}` : ""}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {ag.modalidade || ag.entrega || "Loja"}
                        {ag.endereco && <div style={{ fontSize: "12px", color: "#666" }}>{ag.endereco}</div>}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <button
                          onClick={() => handleExcluirAgendamento(ag.id)}
                          style={{ background: "#d9534f", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          🗑️ Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default Administrador;