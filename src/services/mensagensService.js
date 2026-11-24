import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { normalizarEspacos, soDigitos } from "../utils/validacoes";
import { atualizar, remover } from "./crud";

// Tabela "mensagens" (Apêndice A.1). A política exige mensagem entre 1 e 2000 caracteres.
export async function enviarMensagem({ nome, email, telefone, mensagem }) {
  // Sem .select(): visitantes podem inserir, mas não ler (RLS).
  const { error } = await supabase.from("mensagens").insert({
    nome: normalizarEspacos(nome),
    email: email.trim().toLowerCase(),
    telefone: soDigitos(telefone) || null, // só os 11 números
    mensagem: mensagem.trim(),
  });

  lancarSeErro(error);
}

// ---- Administração ----

export async function listarMensagens() {
  const { data, error } = await supabase
    .from("mensagens")
    .select("id, nome, email, telefone, mensagem, lida, created_at")
    .order("created_at", { ascending: false });

  lancarSeErro(error);
  return data ?? [];
}

export async function alterarLida(id, lida) {
  await atualizar("mensagens", id, { lida });
}

export async function excluirMensagem(id) {
  await remover("mensagens", id);
}
