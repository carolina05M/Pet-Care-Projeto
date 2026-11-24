import { supabase } from "../lib/supabaseClient";
import { lancarSeErro } from "./erros";
import { contagem } from "./crud";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function contar(tabela) {
  return supabase.from(tabela).select("id", { count: "exact", head: true });
}

// Números reais do painel: contagens e soma da receita por consulta.
export async function carregarDashboard() {
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const fimHoje = new Date(inicioHoje);
  fimHoje.setDate(fimHoje.getDate() + 1);

  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioProximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);

  // Semana de segunda a domingo
  const inicioSemana = new Date(inicioHoje);
  inicioSemana.setDate(inicioSemana.getDate() - ((inicioHoje.getDay() + 6) % 7));
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 7);

  const [clientes, pets, hoje, pendentes, naoLidas, receita, semana] =
    await Promise.all([
      contagem(contar("profiles").eq("role", "cliente").eq("ativo", true)),
      contagem(contar("pets")),
      contagem(
        contar("agendamentos")
          .neq("status", "cancelado")
          .gte("data_hora", inicioHoje.toISOString())
          .lt("data_hora", fimHoje.toISOString())
      ),
      contagem(contar("agendamentos").eq("status", "pendente")),
      contagem(contar("mensagens").eq("lida", false)),
      supabase
        .from("agendamentos")
        .select("servicos(preco)")
        .eq("status", "concluido")
        .gte("data_hora", inicioMes.toISOString())
        .lt("data_hora", inicioProximoMes.toISOString()),
      supabase
        .from("agendamentos")
        .select("data_hora")
        .neq("status", "cancelado")
        .gte("data_hora", inicioSemana.toISOString())
        .lt("data_hora", fimSemana.toISOString()),
    ]);

  lancarSeErro(receita.error);
  lancarSeErro(semana.error);

  const receitaMes = (receita.data ?? []).reduce(
    (soma, a) => soma + Number(a.servicos?.preco ?? 0),
    0
  );

  const porDia = DIAS.map((dia) => ({ dia, valor: 0 }));
  for (const a of semana.data ?? []) {
    const indice = (new Date(a.data_hora).getDay() + 6) % 7;
    porDia[indice].valor += 1;
  }

  return {
    clientes,
    pets,
    agendamentosHoje: hoje,
    pendentes,
    mensagensNaoLidas: naoLidas,
    receitaMes,
    semana: porDia,
  };
}
