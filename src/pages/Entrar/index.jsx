
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Entrar.css";

function Entrar() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  function trocarModo() {
    setModoCadastro((atual) => !atual);
    setMostrarSenha(false);
    setMensagem("");
    setNome("");
    setEmail("");
    setSenha("");
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (modoCadastro) {
      setMensagem(
        `Cadastro demonstrativo preenchido! Olá, ${nome}. A criação real da conta será ativada quando conectarmos o Supabase.`
      );
    } else {
      setMensagem(
        "Formulário preenchido! O login real será ativado quando conectarmos o Supabase."
      );
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
                >
                  {modoCadastro
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
