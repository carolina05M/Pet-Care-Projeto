import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [lendoSessao, setLendoSessao] = useState(true);
  // Guarda de qual usuário o perfil já foi carregado (evita "piscar" como não-admin após o login)
  const [perfilCarregadoDe, setPerfilCarregadoDe] = useState(null);

  // 1) Sessão: leitura inicial + escuta de login, logout e renovação de token
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLendoSessao(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao);
      setLendoSessao(false);
      if (!novaSessao) {
        setPerfil(null);
        setPerfilCarregadoDe(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2) Perfil (nome e papel) em um efeito separado, que depende do id do usuário
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    let ativo = true;

    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) console.error("[perfil]", error);
        setPerfil(data ?? null);
        setPerfilCarregadoDe(userId);
        // Cliente desativado pelo administrador: encerra a sessão
        if (data?.ativo === false) supabase.auth.signOut();
      })
      .catch((falha) => {
        // Falha de rede: sem isso o app ficaria preso em "Carregando..."
        if (!ativo) return;
        console.error("[perfil]", falha);
        setPerfil(null);
        setPerfilCarregadoDe(userId);
      });

    return () => {
      ativo = false;
    };
  }, [userId]);

  // "carregando" vale até a sessão ser lida E, se houver usuário, o perfil dele ser carregado
  const carregando =
    lendoSessao || (Boolean(userId) && perfilCarregadoDe !== userId);

  // Chame depois de editar o perfil para atualizar o nome no Header etc.
  async function recarregarPerfil() {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setPerfil(data ?? null);
  }

  const value = {
    session,
    user: session?.user ?? null,
    perfil,
    isAdmin: perfil?.role === "admin",
    carregando,
    recarregarPerfil,
    sair: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
