import React from "react";
import { Link } from "react-router-dom";

export function SidebarAdmin({ abaAtiva, setAbaAtiva }) {
  return (
    <aside className="administrador-sidebar">
      <div className="administrador-logo">
        <span>🐾</span>
        <h2>PetCare</h2>
        <p>Painel Administrativo</p>
      </div>

      <nav className="administrador-menu">
        <button
          onClick={() => setAbaAtiva("geral")}
          className={abaAtiva === "geral" ? "ativo" : ""}
          style={{ background: "transparent", border: "none", color: "#fff", width: "100%", textAlign: "left", padding: "10px", cursor: "pointer", fontSize: "16px", borderRadius: "4px" }}
        >
          📊 Visão Geral
        </button>

        <button
          onClick={() => setAbaAtiva("produtos")}
          className={abaAtiva === "produtos" ? "ativo" : ""}
          style={{ background: "transparent", border: "none", color: "#fff", width: "100%", textAlign: "left", padding: "10px", cursor: "pointer", fontSize: "16px", borderRadius: "4px" }}
        >
          📦 Produtos
        </button>

        <button
          onClick={() => setAbaAtiva("servicos")}
          className={abaAtiva === "servicos" ? "ativo" : ""}
          style={{ background: "transparent", border: "none", color: "#fff", width: "100%", textAlign: "left", padding: "10px", cursor: "pointer", fontSize: "16px", borderRadius: "4px" }}
        >
          ✂️ Serviços
        </button>

        <button
          onClick={() => setAbaAtiva("agendamentos")}
          className={abaAtiva === "agendamentos" ? "ativo" : ""}
          style={{ background: "transparent", border: "none", color: "#fff", width: "100%", textAlign: "left", padding: "10px", cursor: "pointer", fontSize: "16px", borderRadius: "4px" }}
        >
          📅 Agendamentos
        </button>

        <Link to="/" style={{ display: "block", marginTop: "20px", color: "#E2C3A5", textDecoration: "none", padding: "10px" }}>
          🚪 Sair do Painel
        </Link>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;