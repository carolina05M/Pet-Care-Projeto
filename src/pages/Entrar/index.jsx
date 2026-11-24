
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ErroCampo from "../../components/ErroCampo";
import {
  SENHA_MAXIMA,
  SENHA_MINIMA,
  normalizarEspacos,
  temErros,
  validarEmail,
  validarNomePessoa,
  validarSenha,
} from "../../utils/validacoes";
import "./Entrar.css";

function traduzirErro(erro) {
  const texto = erro?.message ?? "";
  const codigo = erro?.code ?? "";

  if (texto.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (texto.includes("already registered") || codigo === "user_already_exists") {
    return "Este e-mail já está cadastrado.";
  }
  if (codigo === "weak_password" || /easy to guess|pwned|leaked|known to be weak/i.test(texto)) {
    return "Esta senha é fraca ou já apareceu em vazamentos conhecidos. Escolha outra.";
  }
  const minimo = texto.match(/at least (\d+)/i);
  if (minimo) {
    return `A senha precisa ter pelo menos ${minimo[1]} caracteres.`;
  }
  if (/password.*(longer|too long)/i.test(texto)) {
    return `A senha deve ter no máximo ${SENHA_MAXIMA} caracteres.`;
  }
  if (/email.*invalid|invalid.*email/i.test(texto)) {
    return "Informe um e-mail válido.";
  }
  if (texto.includes("Email not confirmed")) {
    return "Confirme seu e-mail antes de entrar (verifique a caixa de entrada e o spam).";
  }
  if (texto.includes("rate limit") || texto.includes("too many")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  }
  if (texto.includes("Failed to fetch")) {
    return "Sem conexão com o servidor. Verifique sua internet.";
  }
  if (texto.includes("Database error saving new user")) {
    return "Não foi possível criar o perfil da conta. Avise o administrador do sistema.";
  }
  return "Não foi possível concluir. Tente novamente.";
}

function Entrar() {
  const navigate = useNavigate();
  const local = useLocation();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  function trocarModo() {
    setModoCadastro((atual) => !atual);
    setMostrarSenha(false);
    setMensagem("");
    setErro("");
    setErros({});
    setNome("");
    setEmail("");
    setSenha("");
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setErro("");

    // Validação campo a campo. No login só exigimos preenchimento: a regra de
    // senha forte vale para criar conta, não pode bloquear quem já tem senha antiga.
    const novosErros = modoCadastro
      ? {
          nome: validarNomePessoa(nome),
          email: validarEmail(email),
          senha: validarSenha(senha, { email, nome }),
        }
      : {
          email: validarEmail(email),
          senha: senha ? "" : "Informe a senha.",
        };
    setErros(novosErros);
    if (temErros(novosErros)) return;

    setEnviando(true);
    const emailLimpo = email.trim().toLowerCase();

    if (modoCadastro) {
      const { data, error } = await supabase.auth.signUp({
        email: emailLimpo,
        password: senha,
        options: {
          data: { nome: normalizarEspacos(nome) },
          // O link do e-mail de confirmação volta para o site onde a pessoa se cadastrou
          // (localhost ou produção). O endereço precisa estar em Redirect URLs no Supabase.
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setErro(traduzirErro(error));
      } else if (!data.session) {
        setMensagem("Conta criada! Confirme seu e-mail para entrar.");
      } else {
        navigate("/", { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senha,
      });

      if (error) {
        setErro(traduzirErro(error));
      } else {
        navigate(local.state?.de?.pathname ?? "/", { replace: true });
      }
    }

    setEnviando(false);
  }

  return (
    <>
      <Header />

      <main className="pagina-entrar">
        <section className="entrar-card">
          <div className="entrar-ilustracao">
            <span className="entrar-patinha">🐾</span>
            <h2>Bem-vindo ao PetCare!</h2>
            <p>
              Cuidado, carinho e atenção para quem
              faz parte da sua família.
            </p>
          </div>

          <div className="entrar-conteudo">
            <div className="entrar-titulo">
              <span className="entrar-etiqueta">
                SUA CONTA PETCARE
              </span>

              <h1>
                {modoCadastro ? "Criar conta" : "Entrar"}
              </h1>

              <p>
                {modoCadastro
                  ? "Preencha seus dados para começar."
                  : "Acesse sua conta para cuidar do seu pet."}
              </p>
            </div>

            {mensagem ? (
              <div className="entrar-mensagem" role="status">
                <h3>🐶 Tudo certo!</h3>
                <p>{mensagem}</p>

                <button
                  type="button"
                  className="entrar-botao"
                  onClick={() => setMensagem("")}
                >
                  Voltar ao formulário
                </button>
              </div>
            ) : (
              <form
                className="entrar-formulario"
                onSubmit={enviarFormulario}
                noValidate
              >
                {erro && (
                  <p className="entrar-erro" role="alert">
                    {erro}
                  </p>
                )}

                {modoCadastro && (
                  <>
                    <label htmlFor="nome-cliente">
                      Nome completo
                    </label>

                    <input
                      id="nome-cliente"
                      type="text"
                      placeholder="Digite seu nome"
                      value={nome}
                      onChange={(event) =>
                        setNome(event.target.value)
                      }
                      autoComplete="name"
                      maxLength={80}
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby="erro-nome"
                    />
                    <ErroCampo id="erro-nome" mensagem={erros.nome} />
                  </>
                )}

                <label htmlFor="email-cliente">
                  E-mail
                </label>

                <input
                  id="email-cliente"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  maxLength={254}
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby="erro-email"
                />
                <ErroCampo id="erro-email" mensagem={erros.email} />

                <label htmlFor="senha-cliente">
                  Senha
                </label>

                <div className="entrar-senha">
                  <input
                    id="senha-cliente"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(event) =>
                      setSenha(event.target.value)
                    }
                    autoComplete={
                      modoCadastro
                        ? "new-password"
                        : "current-password"
                    }
                    maxLength={SENHA_MAXIMA}
                    aria-invalid={Boolean(erros.senha)}
                    aria-describedby="erro-senha"
                  />

                  <button
                    type="button"
                    className="mostrar-senha"
                    onClick={() =>
                      setMostrarSenha((atual) => !atual)
                    }
                    aria-label={
                      mostrarSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <ErroCampo id="erro-senha" mensagem={erros.senha} />
                {modoCadastro && !erros.senha && (
                  <small className="campo-dica">
                    Mínimo de {SENHA_MINIMA} caracteres. Uma frase longa é mais
                    segura e mais fácil de lembrar do que símbolos.
                  </small>
                )}

                <button
                  type="submit"
                  className="entrar-botao"
                  disabled={enviando}
                >
                  {enviando
                    ? "Aguarde..."
                    : modoCadastro
                      ? "Criar minha conta"
                      : "Entrar"}
                </button>
              </form>
            )}

            <div className="entrar-alternativa">
              <p>
                {modoCadastro
                  ? "Já tem uma conta?"
                  : "Ainda não tem uma conta?"}
              </p>

              <button
                type="button"
                className="entrar-link"
                onClick={trocarModo}
              >
                {modoCadastro
                  ? "Faça login"
                  : "Cadastre-se"}
              </button>
            </div>

            <Link to="/" className="entrar-voltar">
              Voltar para a página inicial
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Entrar;
