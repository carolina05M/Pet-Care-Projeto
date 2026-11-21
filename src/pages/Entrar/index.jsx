import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Entrar.css";

function Entrar() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function trocarModo() {
    setModoCadastro((atual) => !atual);
    setMostrarSenha(false);
    setMensagem("");
    setErro("");
    setNome("");
    setEmail("");
    setSenha("");
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setCarregando(true);
    setErro("");
    setMensagem("");

    if (modoCadastro) {
      // Criar conta real no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome_completo: nome,
          },
        },
      });

      setCarregando(false);

      if (error) {
        setErro(error.message);
      } else if (data?.user) {
        setMensagem(
          `Conta criada com sucesso para ${nome}! Se a confirmação de e-mail estiver ativa no Supabase, verifique sua caixa de entrada ou já tente fazer login.`
        );
      }
    } else {
      // Fazer login real no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      setCarregando(false);

      if (error) {
        setErro("E-mail ou senha inválidos. Verifique seus dados e tente novamente.");
      } else if (data?.user) {
        navigate("/");
      }
    }
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

            {erro && (
              <div
                role="alert"
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                ⚠️ {erro}
              </div>
            )}

            {mensagem ? (
              <div className="entrar-mensagem" role="status">
                <h3>🐶 Tudo certo!</h3>
                <p>{mensagem}</p>

                <button
                  type="button"
                  className="entrar-botao"
                  onClick={() => {
                    setMensagem("");
                    setModoCadastro(false);
                  }}
                >
                  Ir para o Login
                </button>
              </div>
            ) : (
              <form
                className="entrar-formulario"
                onSubmit={enviarFormulario}
              >
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
                      required
                    />
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
                  required
                />

                <label htmlFor="senha-cliente">
                  Senha
                </label>

                <div className="entrar-senha">
                  <input
                    id="senha-cliente"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha (mín. 6 caracteres)"
                    value={senha}
                    onChange={(event) =>
                      setSenha(event.target.value)
                    }
                    autoComplete={
                      modoCadastro
                        ? "new-password"
                        : "current-password"
                    }
                    minLength={6}
                    required
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

                <button
                  type="submit"
                  className="entrar-botao"
                  disabled={carregando}
                >
                  {carregando
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