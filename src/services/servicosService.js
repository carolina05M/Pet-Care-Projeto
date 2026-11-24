import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { atualizar, inserir, remover } from "./crud";

// Tabela "servicos" (Apêndice A.1): id, nome, descricao, preco, duracao_minutos, icone, ativo
const COLUNAS = "id, nome, descricao, preco, duracao_minutos, icone";

export async function listarServicos() {
  const { data, error } = await supabase
    .from("servicos")
    .select(COLUNAS)
    .eq("ativo", true)
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

// Retorna o serviço ou null (não existe, está inativo ou RLS bloqueou).
export async function buscarServico(id) {
  const { data, error } = await supabase
    .from("servicos")
    .select(COLUNAS)
    .eq("id", id)
    .maybeSingle();

  lancarSeErro(error);
  return data;
}

// ---- Administração (o admin enxerga também os serviços inativos) ----

export async function listarTodosServicos() {
  const { data, error } = await supabase
    .from("servicos")
    .select(`${COLUNAS}, ativo`)
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

export async function salvarServico(id, form) {
  const preco = Number(form.preco);
  const duracao = Number.parseInt(form.duracao_minutos, 10);

  if (!form.nome.trim()) throw new Error("Informe o nome do serviço.");
  if (!(preco >= 0)) throw new Error("Informe um preço válido (0 ou mais).");
  if (!(duracao > 0)) throw new Error("A duração deve ser maior que zero.");

  const dados = {
    nome: form.nome.trim(),
    descricao: form.descricao.trim() || null,
    preco,
    duracao_minutos: duracao,
    icone: form.icone || null,
    ativo: form.ativo,
  };

  if (id) await atualizar("servicos", id, dados);
  else await inserir("servicos", dados);
}

export async function alterarAtivoServico(id, ativo) {
  await atualizar("servicos", id, { ativo });
}

// Falha se já houver agendamentos com este serviço (nesse caso, desative).
export async function excluirServico(id) {
  await remover("servicos", id);
}
