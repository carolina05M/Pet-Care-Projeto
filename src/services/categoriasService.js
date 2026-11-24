import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { atualizar, inserir, remover } from "./crud";

// Colunas assumidas da tabela "categorias": id, nome
export async function listarCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome")
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

// ---- Administração ----

export async function salvarCategoria(id, { nome }) {
  const dados = { nome: nome.trim() };
  if (!dados.nome) throw new Error("Informe o nome da categoria.");
  if (id) await atualizar("categorias", id, dados);
  else await inserir("categorias", dados);
}

// Produtos da categoria ficam "Sem categoria" (on delete set null).
export async function excluirCategoria(id) {
  await remover("categorias", id);
}
