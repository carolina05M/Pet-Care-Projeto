import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { atualizar, inserir, remover } from "./crud";

// Tabela "produtos" (Apêndice A.1): id, categoria_id (FK), nome, descricao, preco, estoque, icone, ativo
const COLUNAS =
  "id, nome, descricao, preco, estoque, icone, categoria_id, categorias(id, nome)";

export async function listarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select(COLUNAS)
    .eq("ativo", true)
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

// Retorna o produto ou null (não existe, está inativo ou RLS bloqueou).
export async function buscarProduto(id) {
  const { data, error } = await supabase
    .from("produtos")
    .select(COLUNAS)
    .eq("id", id)
    .maybeSingle();

  lancarSeErro(error);
  return data;
}

// ---- Administração (o admin enxerga também os produtos inativos) ----

export async function listarTodosProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select(`${COLUNAS}, ativo`)
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

export async function salvarProduto(id, form) {
  const preco = Number(form.preco);
  const estoque = Number.parseInt(form.estoque, 10);

  if (!form.nome.trim()) throw new Error("Informe o nome do produto.");
  if (!(preco >= 0)) throw new Error("Informe um preço válido (0 ou mais).");
  if (!(estoque >= 0)) throw new Error("O estoque não pode ser negativo.");

  const dados = {
    nome: form.nome.trim(),
    descricao: form.descricao.trim() || null,
    preco,
    estoque,
    categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
    icone: form.icone || null,
    ativo: form.ativo,
  };

  if (id) await atualizar("produtos", id, dados);
  else await inserir("produtos", dados);
}

export async function alterarAtivoProduto(id, ativo) {
  await atualizar("produtos", id, { ativo });
}

export async function excluirProduto(id) {
  await remover("produtos", id);
}
