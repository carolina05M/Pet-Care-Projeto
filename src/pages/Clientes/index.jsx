import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function Cliente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDadosCliente() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/entrar", { state: { from: "/cliente" } });
        return;
      }

      setUsuario(user);

      // Busca os agendamentos do cliente logado
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("email", user.email)
        .order("id", { ascending: false });

      if (!error && data) {
        setMeusAgendamentos(data);
      }
      setCarregando(false);
    }

    carregarDadosCliente();
  }, [navigate]);

  async function handleCancelarAgendamento(id) {
    if (!window.confirm("Tens a certeza que queres cancelar este agendamento?")) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao cancelar: " + error.message);
    } else {
      alert("Agendamento cancelado com sucesso!");
      setMeusAgendamentos(meusAgendamentos.filter((ag) => ag.id !== id));
    }
  }

  return (
    <>
      <Header />

      <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", minHeight: "60vh" }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f6f0e8", paddingBottom: "20px", marginBottom: "25px" }}>
            <div>
              <span style={{ background: "#BD835B", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>ÁREA DO CLIENTE</span>
              <h1 style={{ marginTop: "10px", color: "#4B2D27", fontSize: "24px" }}>Carrinho de Agendamentos</h1>
              <p style={{ color: "#666", fontSize: "14px" }}>Gerencie os serviços agendados para os seus pets em tempo real.</p>
            </div>
            <Link to="/servicos" style={{ background: "#4B2D27", color: "#fff", padding: "10px 18px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
              ➕ Agendar Novo Serviço
            </Link>
          </div>

          <h3 style={{ marginBottom: "15px", color: "#4B2D27", fontSize: "18px" }}>📅 Seus Pedidos Ativos</h3>

          {carregando ? (
            <p>A carregar os seus dados...</p>
          ) : meusAgendamentos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#f9f6f0", borderRadius: "10px", border: "1px dashed #dcd6cd" }}>
              <span style={{ fontSize: "40px" }}>🛒</span>
              <h3 style={{ color: "#4B2D27", margin: "10px 0 5px 0" }}>O seu carrinho de agendamentos está vazio</h3>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                Ainda não marcou nenhum banho, tosa ou cuidado especial para o seu pet.
              </p>
              
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link 
                  to="/servicos" 
                  style={{ background: "#BD835B", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}
                >
                  Ver Serviços Disponíveis
                </Link>
                <Link 
                  to="/produtos" 
                  style={{ background: "#fff", color: "#4B2D27", border: "1px solid #4B2D27", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}
                >
                  Ver Produtos da Loja
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {meusAgendamentos.map((ag) => (
                <div 
                  key={ag.id} 
                  style={{ 
                    border: "1px solid #e8e1d7", 
                    padding: "20px", 
                    borderRadius: "10px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "#faf8f5",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ background: "#4B2D27", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                        PEDIDO #{ag.id}
                      </span>
                      <span style={{ color: "#27ae60", fontSize: "13px", fontWeight: "bold" }}>● Confirmado</span>
                    </div>

                    <h4 style={{ color: "#4B2D27", fontSize: "18px", marginTop: "5px" }}>
                      🐾 Pet: {ag.nome_pet || ag.pet}
                    </h4>
                    <p style={{ margin: "0", color: "#444" }}><strong>Serviço:</strong> {ag.servico || ag.nome_servico || "Serviço PetCare"}</p>
                    <p style={{ margin: "0", color: "#444" }}><strong>Data e Hora:</strong> {ag.data} às {ag.horario}</p>
                    <p style={{ margin: "0", color: "#666", fontSize: "13px" }}><strong>Modalidade:</strong> {ag.tipo_atendimento === "buscar" ? "📦 Buscamos em casa" : "🏪 Levará na loja"}</p>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => handleCancelarAgendamento(ag.id)}
                      style={{ 
                        background: "#fff", 
                        color: "#d9534f", 
                        border: "1px solid #d9534f", 
                        padding: "8px 14px", 
                        borderRadius: "6px", 
                        cursor: "pointer", 
                        fontWeight: "bold",
                        fontSize: "13px",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.target.style.background = "#d9534f"; e.target.style.color = "#fff"; }}
                      onMouseOut={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#d9534f"; }}
                    >
                      ❌ Cancelar Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cliente;