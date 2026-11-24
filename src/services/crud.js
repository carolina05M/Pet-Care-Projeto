import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";

// Operações genéricas por id, usadas pelo painel administrativo.
// A RLS decide se a operação é permitida; quando ela bloqueia, o Supabase devolve
// lista vazia (não erro), por isso conferimos o retorno de update/delete.

export async function inserir(tabela, dados) {
  const { error } = await supabase.from(tabela).insert(dados);
  lancarSeErro(error);
}

export async function atualizar(tabela, id, dados) {
  const { data, error } = await supabase
    .from(tabela)
    .update(dados)
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  if (!data?.length) throw new Error("Registro não encontrado ou sem permissão.");
}

export async function remover(tabela, id) {
  const { data, error } = await supabase
    .from(tabela)
    .delete()
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  if (!data?.length) throw new Error("Registro não encontrado ou sem permissão.");
}

// Conta linhas sem baixar dados.
export function contagem(consulta) {
  return consulta.then(({ count, error }) => {
    lancarSeErro(error);
    return count ?? 0;
  });
}
