import { useEffect, useState } from "react";

// Executa uma função assíncrona de leitura e devolve { dados, carregando, erro, recarregar }.
// Importante: passe uma função estável (a importada de um service), não uma função criada no render.
export function useConsulta(consulta) {
  const [estado, setEstado] = useState({
    dados: null,
    carregando: true,
    erro: "",
  });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    consulta()
      .then((dados) => {
        if (ativo) setEstado({ dados, carregando: false, erro: "" });
      })
      .catch((e) => {
        if (ativo) setEstado({ dados: null, carregando: false, erro: e.message });
      });

    return () => {
      ativo = false;
    };
  }, [consulta, tentativa]);

  function recarregar() {
    setEstado((atual) => ({ ...atual, carregando: true, erro: "" }));
    setTentativa((n) => n + 1);
  }

  return { ...estado, recarregar };
}
