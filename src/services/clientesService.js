import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { atualizar } from "./crud";
import {
  normalizarEspacos,
  soDigitos,
  validarNomePessoa,
  validarTelefone,
} from "../utils/validacoes";

// O e-mail e a senha pertencem ao Supabase Auth e não são expostos pela tabela profiles.
export async function listarClientes() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, telefone, role, ativo, created_at")
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

// O administrador edita somente os dados de perfil autorizados pelo banco.
export async function editarCliente(id, dados) {
  const nome = normalizarEspacos(dados.nome);
  const telefone = soDigitos(dados.telefone);
  const erroNome = validarNomePessoa(nome);
  const erroTelefone = validarTelefone(telefone);

  if (erroNome) throw new Error(erroNome);
  if (erroTelefone) throw new Error(erroTelefone);

  await atualizar("profiles", id, {
    nome,
    telefone: telefone || null,
  });
}

// Desativar é a exclusão lógica: preserva auth.users, pets e histórico.
export async function alterarAtivoCliente(id, ativo) {
  await atualizar("profiles", id, { ativo });
}
