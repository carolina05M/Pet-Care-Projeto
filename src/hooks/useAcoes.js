import { useState } from "react";

// Controla avisos de sucesso/erro de ações (salvar, excluir, mudar status...).
// "executar" roda a ação, mostra a mensagem e recarrega a lista; devolve true/false.
export function useAcoes(recarregar) {
  const [aviso, setAviso] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  async function executar(acao, mensagemSucesso) {
    setAviso("");
    setErroAcao("");
    try {
      await acao();
      if (mensagemSucesso) setAviso(mensagemSucesso);
      recarregar();
      return true;
    } catch (falha) {
      setErroAcao(falha.message);
      return false;
    }
  }

  function limpar() {
    setAviso("");
    setErroAcao("");
  }

  return { aviso, erroAcao, executar, limpar };
}
