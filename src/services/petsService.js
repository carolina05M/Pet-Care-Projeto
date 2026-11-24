import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { atualizar, inserir, remover } from "./crud";
import { exigirUsuarioId } from "./sessao";
import {
  normalizarEspacos,
  validarNomePet,
  validarRaca,
  validarNascimento,
  validarTexto,
} from "../utils/validacoes";

// Tabela "pets": id, tutor_id, nome, especie, raca, data_nascimento, observacoes
const COLUNAS = "id, nome, especie, raca, data_nascimento, observacoes";

// Prepara os dados do formulário para o banco (tutor_id vem do default auth.uid()).
function prepararDados(dados) {
  return {
    nome: normalizarEspacos(dados.nome),
    especie: dados.especie,
    raca: normalizarEspacos(dados.raca) || null,
    data_nascimento: dados.data_nascimento || null,
    observacoes: (dados.observacoes ?? "").trim() || null,
  };
}

export async function listarMeusPets() {
  const usuarioId = await exigirUsuarioId();
  const { data, error } = await supabase
    .from("pets")
    .select(COLUNAS)
    .eq("tutor_id", usuarioId)
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

export async function criarPet(dados) {
  const { error } = await supabase.from("pets").insert(prepararDados(dados));
  lancarSeErro(error);
}

export async function atualizarPet(id, dados) {
  const { data, error } = await supabase
    .from("pets")
    .update(prepararDados(dados))
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  // RLS bloqueando devolve lista vazia, não erro
  if (!data?.length) throw new Error("Pet não encontrado ou sem permissão.");
}

export async function excluirPet(id) {
  const { data, error } = await supabase
    .from("pets")
    .delete()
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  if (!data?.length) throw new Error("Pet não encontrado ou sem permissão.");
}


// ---- Administração ----

// Lista todos os pets com o tutor e o ID necessário para edição.
export async function listarTodosPetsAdmin() {
  const { data, error } = await supabase
    .from("pets")
    .select(
      "id, tutor_id, nome, especie, raca, data_nascimento, observacoes, tutor:profiles!tutor_id(nome)"
    )
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

// Lista clientes para preencher o seletor de tutor. Inclui inativos para
// não impedir a edição de pets que já pertencem a uma conta desativada.
export async function listarClientesParaPets() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, ativo")
    .eq("role", "cliente")
    .order("nome", { ascending: true });

  lancarSeErro(error);
  return data ?? [];
}

export async function salvarPetAdmin(id, dados) {
  const nomeErro = validarNomePet(dados.nome);
  const racaErro = validarRaca(dados.raca);
  const nascimentoErro = validarNascimento(dados.data_nascimento);
  const observacoesErro = validarTexto(dados.observacoes, {
    rotulo: "As observações",
    maximo: 500,
  });

  if (!dados.tutor_id) throw new Error("Selecione o tutor do pet.");
  if (nomeErro) throw new Error(nomeErro);
  if (racaErro) throw new Error(racaErro);
  if (nascimentoErro) throw new Error(nascimentoErro);
  if (observacoesErro) throw new Error(observacoesErro);
  if (!["cachorro", "gato", "outro"].includes(dados.especie)) {
    throw new Error("Selecione uma espécie válida.");
  }

  const registro = {
    ...prepararDados(dados),
    tutor_id: dados.tutor_id,
  };

  if (id) await atualizar("pets", id, registro);
  else await inserir("pets", registro);
}

// A exclusão pode remover agendamentos vinculados, conforme a FK atual.
export async function excluirPetAdmin(id) {
  await remover("pets", id);
}
