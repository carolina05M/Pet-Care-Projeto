import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { exigirUsuarioId } from "./sessao";
import { atualizar, inserir, remover } from "./crud";
import { MODO_DEMO } from "../config";

// Consultas da área do cliente.
const COLUNAS =
  "id, data_hora, status, observacoes, servicos(nome, preco), pets(nome)";

// Consultas administrativas. Os nomes das FKs foram conferidos no esquema
// enviado: agendamentos_cliente_id_fkey, agendamentos_pet_id_fkey e
// agendamentos_servico_id_fkey.
const COLUNAS_ADMIN =
  "id, cliente_id, pet_id, servico_id, data_hora, status, observacoes, " +
  "cliente:profiles!agendamentos_cliente_id_fkey(id, nome, telefone, ativo), " +
  "pet:pets!agendamentos_pet_id_fkey(id, tutor_id, nome, especie), " +
  "servico:servicos!agendamentos_servico_id_fkey(id, nome, preco, duracao_minutos, ativo)";

const STATUS_VALIDOS = ["pendente", "confirmado", "concluido", "cancelado"];

// Converte a data e a hora digitadas no navegador para timestamptz.
// A criação com new Date(ano, mês, dia, hora, minuto) interpreta o horário
// no fuso local do estabelecimento/navegador, antes de converter para ISO.
function converterDataHoraLocal(data, horario) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data ?? "")) {
    throw new Error("Informe uma data válida para o agendamento.");
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario ?? "")) {
    throw new Error("Informe um horário válido para o agendamento.");
  }

  const [ano, mes, dia] = data.split("-").map(Number);
  const [hora, minuto] = horario.split(":").map(Number);
  const valor = new Date(ano, mes - 1, dia, hora, minuto, 0, 0);

  // Evita que datas inexistentes (por exemplo, 31/02) sejam normalizadas
  // automaticamente pelo objeto Date para outro dia.
  if (
    valor.getFullYear() !== ano ||
    valor.getMonth() !== mes - 1 ||
    valor.getDate() !== dia ||
    valor.getHours() !== hora ||
    valor.getMinutes() !== minuto
  ) {
    throw new Error("A data ou o horário informado não existe.");
  }

  return valor.toISOString();
}

// Confere a relação cliente/pet antes de salvar. A RLS permite ao admin
// gerenciar registros, mas as FKs isoladas não garantem que o pet pertença
// ao cliente selecionado.
async function validarClienteEPet(clienteId, petId) {
  if (!clienteId) throw new Error("Selecione o cliente.");
  if (!petId) throw new Error("Selecione o pet.");

  const [cliente, pet] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, role")
      .eq("id", clienteId)
      .maybeSingle(),
    supabase
      .from("pets")
      .select("id, tutor_id")
      .eq("id", petId)
      .maybeSingle(),
  ]);

  lancarSeErro(cliente.error);
  lancarSeErro(pet.error);

  if (!cliente.data || cliente.data.role !== "cliente") {
    throw new Error("O cliente selecionado não foi encontrado ou não é uma conta de cliente.");
  }
  if (!pet.data) {
    throw new Error("O pet selecionado não foi encontrado.");
  }
  if (pet.data.tutor_id !== clienteId) {
    throw new Error("O pet selecionado não pertence ao cliente informado.");
  }
}

// Cliente autenticado: cliente_id e status são definidos pelo banco/RLS.
export async function criarAgendamento({
  petId,
  servicoId,
  data,
  horario,
  observacoes,
}) {
  const quando = new Date(`${data}T${horario}:00`);
  if (Number.isNaN(quando.getTime()) || quando <= new Date()) {
    throw new Error("Escolha uma data e um horário no futuro.");
  }

  const { error } = await supabase.from("agendamentos").insert({
    pet_id: petId,
    servico_id: servicoId,
    data_hora: quando.toISOString(),
    observacoes: observacoes?.trim() || null,
  });

  lancarSeErro(error);
}

async function listarMeus(statuses, crescente) {
  const usuarioId = await exigirUsuarioId();
  const { data, error } = await supabase
    .from("agendamentos")
    .select(COLUNAS)
    .eq("cliente_id", usuarioId)
    .in("status", statuses)
    .order("data_hora", { ascending: crescente });

  lancarSeErro(error);
  return data ?? [];
}

// Próximos: pendentes e confirmados, do mais próximo para o mais distante.
export function listarAgendamentosAtivos() {
  return listarMeus(["pendente", "confirmado"], true);
}

// Histórico: concluídos e cancelados, do mais recente para o mais antigo.
export function listarHistoricoAgendamentos() {
  return listarMeus(["concluido", "cancelado"], false);
}

// Cancelar = alterar o status (a RLS só permite o cliente mudar para 'cancelado').
export async function cancelarAgendamento(id) {
  const { data, error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado" })
    .eq("id", id)
    .select("id");

  lancarSeErro(error);
  if (!data?.length) throw new Error("Agendamento não encontrado.");
}

// Dados do painel "Minha conta": quantidade de pets e agendamentos separados em
// próximos (pendente/confirmado e ainda por vir) e histórico (o resto).
export async function carregarResumoConta() {
  const usuarioId = await exigirUsuarioId();

  const [pets, agendamentos] = await Promise.all([
    supabase
      .from("pets")
      .select("id", { count: "exact", head: true })
      .eq("tutor_id", usuarioId),
    supabase
      .from("agendamentos")
      .select(COLUNAS)
      .eq("cliente_id", usuarioId)
      .order("data_hora", { ascending: true }),
  ]);

  lancarSeErro(pets.error);
  lancarSeErro(agendamentos.error);

  const agora = new Date();
  const todos = agendamentos.data ?? [];
  const proximos = todos.filter(
    (a) =>
      (a.status === "pendente" || a.status === "confirmado") &&
      new Date(a.data_hora) >= agora
  );

  return {
    totalPets: pets.count ?? 0,
    proximos,
    totalHistorico: todos.length - proximos.length,
  };
}

// ---- Administração ----

// Lista todos os agendamentos visíveis ao administrador, com os IDs necessários
// para editar cada relacionamento. O banco aplica as políticas RLS.
export async function listarAgendamentosAdmin({
  data,
  status,
  crescente = false,
} = {}) {
  let consulta = supabase
    .from("agendamentos")
    .select(COLUNAS_ADMIN)
    .order("data_hora", { ascending: crescente });

  if (Array.isArray(status)) consulta = consulta.in("status", status);
  else if (status) consulta = consulta.eq("status", status);

  if (data) {
    const inicio = new Date(`${data}T00:00:00`);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 1);
    consulta = consulta
      .gte("data_hora", inicio.toISOString())
      .lt("data_hora", fim.toISOString());
  }

  const { data: linhas, error } = await consulta;
  lancarSeErro(error);
  return linhas ?? [];
}

// Opções dos selects do formulário administrativo. Inclui clientes e serviços
// inativos para que registros históricos possam continuar sendo editados.
export async function carregarOpcoesAgendamentoAdmin() {
  const [clientes, pets, servicos] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, nome, telefone, ativo")
      .eq("role", "cliente")
      .order("nome", { ascending: true }),
    supabase
      .from("pets")
      .select("id, tutor_id, nome, especie")
      .order("nome", { ascending: true }),
    supabase
      .from("servicos")
      .select("id, nome, preco, duracao_minutos, ativo")
      .order("nome", { ascending: true }),
  ]);

  lancarSeErro(clientes.error);
  lancarSeErro(pets.error);
  lancarSeErro(servicos.error);

  return {
    clientes: clientes.data ?? [],
    pets: pets.data ?? [],
    servicos: servicos.data ?? [],
  };
}

// CREATE e UPDATE administrativos. O administrador define explicitamente o
// cliente, o pet, o serviço, a data/hora, o status e as observações.
export async function salvarAgendamentoAdmin(id, formulario) {
  const clienteId = formulario.cliente_id;
  const petId = formulario.pet_id;
  const servicoId = Number(formulario.servico_id);
  const status = formulario.status;

  if (!Number.isSafeInteger(servicoId) || servicoId <= 0) {
    throw new Error("Selecione um serviço válido.");
  }
  if (!STATUS_VALIDOS.includes(status)) {
    throw new Error("Selecione um status válido.");
  }

  const dataHora = converterDataHoraLocal(formulario.data, formulario.horario);

  // Mesma regra do botão "Concluir": não dá para concluir um atendimento que ainda não aconteceu.
  if (status === "concluido" && !podeConcluir(dataHora)) {
    throw new Error("Este agendamento ainda não aconteceu, então não pode ser marcado como concluído.");
  }
  if ((formulario.observacoes ?? "").length > 500) {
    throw new Error("As observações podem ter no máximo 500 caracteres.");
  }

  await validarClienteEPet(clienteId, petId);

  const registro = {
    cliente_id: clienteId,
    pet_id: petId,
    servico_id: servicoId,
    data_hora: dataHora,
    status,
    observacoes: formulario.observacoes?.trim() || null,
  };

  if (id) await atualizar("agendamentos", id, registro);
  else await inserir("agendamentos", registro);
}

// DELETE administrativo. A política agend_delete_admin autoriza somente admin.
export async function excluirAgendamentoAdmin(id) {
  await remover("agendamentos", id);
}

// Só dá para concluir um atendimento que já começou (a menos que o modo demonstração esteja ligado).
export function podeConcluir(dataHora) {
  return MODO_DEMO || new Date(dataHora) <= new Date();
}

export async function alterarStatusAgendamento(id, status, { dataHora } = {}) {
  if (!STATUS_VALIDOS.includes(status)) {
    throw new Error("Status de agendamento inválido.");
  }
  if (status === "concluido" && dataHora && !podeConcluir(dataHora)) {
    throw new Error("Este agendamento ainda não aconteceu, então não pode ser concluído.");
  }
  await atualizar("agendamentos", id, { status });
}
