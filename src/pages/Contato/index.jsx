import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ErroCampo from "../../components/ErroCampo";
import { enviarMensagem } from "../../services/mensagensService";
import {
  formatarTelefone,
  temErros,
  validarEmail,
  validarNomePessoa,
  validarTelefone,
  validarTexto,
} from "../../utils/validacoes";
import "./Contato.css";

const FORMULARIO_VAZIO = { nome: "", email: "", telefone: "", mensagem: "" };

function Contato() {
  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});

  function atualizar(campo) {
    return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }));
  }

  function atualizarTelefone(e) {
    setForm((atual) => ({ ...atual, telefone: formatarTelefone(e.target.value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    const novosErros = {
      nome: validarNomePessoa(form.nome),
      email: validarEmail(form.email),
      telefone: validarTelefone(form.telefone),
      mensagem: validarTexto(form.mensagem, {
        rotulo: "A mensagem",
        minimo: 10,
        maximo: 2000,
        obrigatorio: true,
      }),
    };
    setErros(novosErros);
    if (temErros(novosErros)) return;

    setEnviando(true);

    try {
      await enviarMensagem(form);
      setForm(FORMULARIO_VAZIO);
      setErros({});
      setSucesso(true);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="pagina-contato">
        <section className="contato-intro">
          <span className="contato-etiqueta">Fale Conosco</span>
          <h1>Estamos prontos para atender o seu pet</h1>
          <p>
            Dúvidas, agendamentos ou informações? Entre em contato conosco ou envie uma mensagem abaixo.
          </p>
        </section>

        <section className="contato-conteudo">
          {/* Informações de Contato */}
          <div className="contato-info">
            <h2>Nossos Contatos</h2>
            
            <div className="info-card">
              <div className="info-icone">📍</div>
              <div>
                <h3>Localização</h3>
                <p>Cacoal - RO</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">📞</div>
              <div>
                <h3>Telefone / WhatsApp</h3>
                <p>(69) 99999-8888</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">✉️</div>
              <div>
                <h3>E-mail</h3>
                <p>contato@petcare.com.br</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icone">⏰</div>
              <div>
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta: 08:00 - 18:00</p>
                <p>Sábado: 08:00 - 12:00</p>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <form className="contato-formulario" onSubmit={handleSubmit} noValidate>
            <h2>Envie uma Mensagem</h2>

            {sucesso && (
              <p className="contato-sucesso" role="status">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </p>
            )}

            {erro && (
              <p className="contato-erro" role="alert">
                {erro}
              </p>
            )}

            <div className="campo-grupo">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={atualizar("nome")}
                autoComplete="name"
                maxLength={80}
                aria-invalid={Boolean(erros.nome)}
                aria-describedby="erro-contato-nome"
              />
              <ErroCampo id="erro-contato-nome" mensagem={erros.nome} />
            </div>

            <div className="campo-grupo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                value={form.email}
                onChange={atualizar("email")}
                autoComplete="email"
                maxLength={254}
                aria-invalid={Boolean(erros.email)}
                aria-describedby="erro-contato-email"
              />
              <ErroCampo id="erro-contato-email" mensagem={erros.email} />
            </div>

            <div className="campo-grupo">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                placeholder="(69) 99999-9999"
                value={form.telefone}
                onChange={atualizarTelefone}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={15}
                aria-invalid={Boolean(erros.telefone)}
                aria-describedby="erro-contato-telefone"
              />
              <ErroCampo id="erro-contato-telefone" mensagem={erros.telefone} />
            </div>

            <div className="campo-grupo">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                rows="5"
                placeholder="Como podemos ajudar você e seu pet?"
                value={form.mensagem}
                onChange={atualizar("mensagem")}
                maxLength={2000}
                aria-invalid={Boolean(erros.mensagem)}
                aria-describedby="erro-contato-mensagem"
              ></textarea>
              <ErroCampo id="erro-contato-mensagem" mensagem={erros.mensagem} />
            </div>

            <button type="submit" className="btn-enviar" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contato;