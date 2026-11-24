import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EstadoConsulta from "../../components/EstadoConsulta";
import ErroCampo from "../../components/ErroCampo";
import { useConsulta } from "../../hooks/useConsulta";
import { carregarResumoConta } from "../../services/agendamentosService";
import { atualizarPerfil } from "../../services/perfilService";
import { formatarDataHora, ROTULOS_STATUS } from "../../utils/formatadores";
import {
  exibirTelefone,
  formatarTelefone,
  temErros,
  validarNomePessoa,
  validarTelefone,
} from "../../utils/validacoes";
import styles from "../AreaCliente.module.css";

function FormularioPerfil() {
  const { user, perfil, recarregarPerfil } = useAuth();
  const [nome, setNome] = useState(perfil?.nome ?? "");
  const [telefone, setTelefone] = useState(exibirTelefone(perfil?.telefone));
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");

  async function enviar(evento) {
    evento.preventDefault();
    setAviso("");
    setErro("");

    const novosErros = {
      nome: validarNomePessoa(nome),
      telefone: validarTelefone(telefone),
    };
    setErros(novosErros);
    if (temErros(novosErros)) return;

    setEnviando(true);

    try {
      await atualizarPerfil(user.id, { nome, telefone });
      await recarregarPerfil();
      setAviso("Perfil atualizado com sucesso!");
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className={`${styles.cartao} ${styles.formulario}`} onSubmit={enviar} noValidate>
      {aviso && (
        <p className={styles.aviso} role="status">
          {aviso}
        </p>
      )}
      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      <label htmlFor="perfil-email">E-mail</label>
      <input id="perfil-email" type="email" value={user?.email ?? ""} disabled />

      <label htmlFor="perfil-nome">Nome</label>
      <input
        id="perfil-nome"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        maxLength={80}
        aria-invalid={Boolean(erros.nome)}
        aria-describedby="erro-perfil-nome"
      />
      <ErroCampo id="erro-perfil-nome" mensagem={erros.nome} />

      <label htmlFor="perfil-telefone">Telefone (opcional)</label>
      <input
        id="perfil-telefone"
        type="tel"
        value={telefone}
        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
        maxLength={15}
        inputMode="numeric"
        placeholder="(69) 99999-9999"
        autoComplete="tel"
        aria-invalid={Boolean(erros.telefone)}
        aria-describedby="erro-perfil-telefone"
      />
      <ErroCampo id="erro-perfil-telefone" mensagem={erros.telefone} />

      <div className={styles.acoes}>
        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}

function MinhaConta() {
  const { perfil } = useAuth();
  const { dados: resumo, carregando, erro, recarregar } =
    useConsulta(carregarResumoConta);

  return (
    <>
      <Header />

      <main className={styles.pagina}>
        <div className={styles.topo}>
          <div>
            <h1>Olá, {perfil?.nome ?? "tutor"}!</h1>
            <p className={styles.subtitulo}>Resumo da sua conta no PetCare.</p>
          </div>

          <div className={styles.acoes}>
            <Link to="/meus-pets" className={`${styles.botao} ${styles.botaoSecundario}`}>
              Meus pets
            </Link>
            <Link
              to="/meus-agendamentos"
              className={`${styles.botao} ${styles.botaoSecundario}`}
            >
              Meus agendamentos
            </Link>
            <Link to="/servicos" className={styles.botao}>
              Agendar serviço
            </Link>
          </div>
        </div>

        <EstadoConsulta
          carregando={carregando}
          erro={erro}
          onTentarNovamente={recarregar}
        >
          {resumo && (
            <>
              <div className={styles.numeros}>
                <div className={`${styles.cartao} ${styles.numero}`}>
                  <strong>{resumo.totalPets}</strong>
                  <span>{resumo.totalPets === 1 ? "pet cadastrado" : "pets cadastrados"}</span>
                </div>
                <div className={`${styles.cartao} ${styles.numero}`}>
                  <strong>{resumo.proximos.length}</strong>
                  <span>próximos agendamentos</span>
                </div>
                <div className={`${styles.cartao} ${styles.numero}`}>
                  <strong>{resumo.totalHistorico}</strong>
                  <span>
                    no <Link to="/meus-agendamentos/historico">histórico</Link>
                  </span>
                </div>
              </div>

              <section className={styles.secao}>
                <h2>Próximos agendamentos</h2>
                {resumo.proximos.length === 0 ? (
                  <p className={styles.subtitulo}>
                    Nenhum agendamento por vir.{" "}
                    <Link to="/servicos">Agendar agora</Link>
                  </p>
                ) : (
                  <ul className={styles.lista}>
                    {resumo.proximos.slice(0, 3).map((a) => (
                      <li
                        key={a.id}
                        className={`${styles.cartao} ${styles.itemAgendamento}`}
                      >
                        <div>
                          <h3>{a.servicos?.nome ?? "Serviço indisponível"}</h3>
                          <p className={styles.detalhe}>
                            {a.pets?.nome ?? "Pet removido"} · {formatarDataHora(a.data_hora)}
                          </p>
                        </div>
                        <span
                          className={`${styles.etiqueta} ${styles[`status_${a.status}`]}`}
                        >
                          {ROTULOS_STATUS[a.status] ?? a.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </EstadoConsulta>

        <section className={styles.secao}>
          <h2>Editar perfil</h2>
          <FormularioPerfil />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MinhaConta;
