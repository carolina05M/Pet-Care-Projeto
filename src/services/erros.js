// Traduz erros do Supabase/PostgREST para mensagens em português.
export function mensagemDeErro(erro) {
  const texto = erro?.message ?? "";
  const codigo = erro?.code ?? "";

  if (texto.includes("Failed to fetch") || texto.includes("NetworkError")) {
    return "Sem conexão com o servidor. Verifique sua internet e tente de novo.";
  }
  if (codigo === "42501" || texto.includes("row-level security")) {
    return "Você não tem permissão para realizar esta ação.";
  }
  if (codigo === "42P01" || codigo === "PGRST205") {
    return "Tabela não encontrada no banco. Confira se o SQL do Apêndice A foi executado.";
  }
  if (codigo === "22P02") {
    return "Um dos campos contém um valor em formato inválido. Confira os dados e tente de novo.";
  }
  if (codigo === "23505") {
    if (texto.includes("agendamentos_horario_unico")) {
      return "Este horário já está ocupado. Escolha outro.";
    }
    return "Já existe um registro com esses dados.";
  }
  if (codigo === "23503") {
    return "Este item já tem registros vinculados (por exemplo, agendamentos, mesmo cancelados) e não pode ser excluído, para preservar o histórico. Desative-o para escondê-lo dos clientes.";
  }
  if (codigo === "23514") {
    if (texto.includes("telefone")) {
      return "Telefone inválido. Use 11 números: DDD + 9 dígitos.";
    }
    return "Algum valor é inválido. Confira os campos e tente de novo.";
  }
  if (codigo === "42703") {
    return "Coluna não encontrada no banco. Confira os nomes em src/services.";
  }
  // Erros lançados de propósito por triggers/funções do banco (já vêm em português)
  if (codigo === "P0001" && texto) {
    return texto;
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

// Lança um Error com mensagem amigável quando a consulta do Supabase falhou.
export function lancarSeErro(error) {
  if (error) {
    console.error("[Supabase]", error);
    throw new Error(mensagemDeErro(error));
  }
}
