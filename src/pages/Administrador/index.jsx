import { useState } from "react";
import { supabase } from "../../services/supabaseClient";

function CadastroProdutoAdmin() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);

    const { error } = await supabase.from("produtos").insert([
      {
        nome: nome,
        descricao: descricao,
        preco: Number(preco),
      },
    ]);

    setCarregando(false);

    if (error) {
      alert("Erro ao cadastrar produto: " + error.message);
    } else {
      alert("Produto cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      setPreco("");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h3>Cadastrar Novo Produto</h3>
      
      <input
        type="text"
        placeholder="Nome do Produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <input
        type="number"
        step="0.01"
        placeholder="Preço (Ex: 49.90)"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      <button type="submit" disabled={carregando} style={{ padding: "10px", background: "#4b2d27", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        {carregando ? "Cadastrando..." : "Salvar Produto"}
      </button>
    </form>
  );
}