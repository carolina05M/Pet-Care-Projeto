import "./ErroCampo.css";

// Mensagem de erro logo abaixo do campo que tem o problema.
// Use com aria-invalid / aria-describedby no input para leitores de tela.
function ErroCampo({ id, mensagem }) {
  if (!mensagem) return null;
  return (
    <span id={id} className="campo-erro" role="alert">
      {mensagem}
    </span>
  );
}

export default ErroCampo;
