export function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// 90 -> "1 hora e 30 minutos"; 30 -> "30 minutos"; 120 -> "2 horas"
export function formatarDuracao(minutos) {
  if (!minutos) return "A combinar";
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} minutos`;
  const horas = h === 1 ? "1 hora" : `${h} horas`;
  return m === 0 ? horas : `${horas} e ${m} minutos`;
}

export function formatarDataHora(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Recebe "2024-05-03" (coluna date) e devolve "03/05/2024", sem conversão de fuso.
export function formatarData(dataIso) {
  if (!dataIso) return "";
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export const ROTULOS_STATUS = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};
