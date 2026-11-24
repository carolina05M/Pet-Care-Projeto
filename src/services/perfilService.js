import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { normalizarEspacos, soDigitos } from "../utils/validacoes";

// O cliente só pode alterar nome e telefone; o papel (role) é protegido por trigger.
export async function atualizarPerfil(id, { nome, telefone }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ nome: normalizarEspacos(nome), telefone: soDigitos(telefone) || null })
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  if (!data?.length) throw new Error("Perfil não encontrado.");
}
