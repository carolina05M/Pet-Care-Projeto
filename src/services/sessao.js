import { supabase } from "../lib/supabaseClient";

// Id do usuário logado, lido da sessão local (sem ir ao servidor).
// Usado para filtrar "meus" dados: o admin enxerga os dados de todos pela RLS,
// então a área do cliente precisa filtrar explicitamente pelo próprio id.
export async function exigirUsuarioId() {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user?.id;
  if (!id) throw new Error("Você precisa entrar na sua conta.");
  return id;
}
