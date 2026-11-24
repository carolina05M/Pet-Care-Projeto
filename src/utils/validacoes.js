// Regras de validação reutilizáveis. Cada função devolve "" quando o valor é
// válido ou a mensagem (em português) do problema, para exibir junto ao campo.
// Atenção: a validação do navegador é só conforto; o que protege de verdade é o banco.

export const SENHA_MINIMA = 12; // NIST SP 800-63B-4 pede 15 quando a senha é o único fator
export const SENHA_MAXIMA = 72; // limite do bcrypt usado pelo Supabase

export function soDigitos(texto) {
  return (texto ?? "").replace(/\D/g, "");
}

// ---------- Telefone ----------

// Máscara enquanto digita: (69) 99999-9999 (ignora tudo que não for dígito)
export function formatarTelefone(valor) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Para exibir valores já salvos (com ou sem máscara, 10 ou 11 dígitos).
export function exibirTelefone(valor) {
  const d = soDigitos(valor);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return valor ?? "";
}

// Celular brasileiro: DDD (2 dígitos) + 9 + 8 dígitos = 11 números.
const REGEX_CELULAR = /^[1-9][1-9]9\d{8}$/;

export function telefoneValido(valor) {
  return REGEX_CELULAR.test(soDigitos(valor));
}

export function validarTelefone(valor, { obrigatorio = false } = {}) {
  const digitos = soDigitos(valor);
  if (!digitos) return obrigatorio ? "Informe o telefone." : "";
  if (digitos.length !== 11) {
    return "O telefone deve ter 11 números: DDD + 9 dígitos. Ex.: (69) 99999-9999.";
  }
  if (!REGEX_CELULAR.test(digitos)) return "Telefone inválido. Confira o DDD e o número.";
  return "";
}

// ---------- E-mail ----------

const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function validarEmail(valor) {
  const email = (valor ?? "").trim();
  if (!email) return "Informe o e-mail.";
  if (email.length > 254) return "E-mail muito longo.";
  if (!REGEX_EMAIL.test(email) || email.includes("..")) {
    return "Informe um e-mail válido. Ex.: nome@exemplo.com.";
  }
  return "";
}

// ---------- Nomes ----------

function normalizarEspacos(texto) {
  return (texto ?? "").trim().replace(/\s+/g, " ");
}

export { normalizarEspacos };

// Pessoa: letras (com acento), espaço, apóstrofo, hífen e ponto.
export function validarNomePessoa(valor) {
  const nome = normalizarEspacos(valor);
  if (!nome) return "Informe o nome.";
  if (nome.length < 2) return "O nome deve ter pelo menos 2 letras.";
  if (nome.length > 80) return "O nome deve ter no máximo 80 caracteres.";
  if (!/^\p{L}[\p{L}' .-]*$/u.test(nome)) {
    return "Use apenas letras, espaços, hífen e apóstrofo no nome.";
  }
  return "";
}

// Pet: igual ao da pessoa, mas aceita também números (ex.: "Rex 2").
export function validarNomePet(valor) {
  const nome = normalizarEspacos(valor);
  if (!nome) return "Informe o nome do pet.";
  if (nome.length > 40) return "O nome do pet deve ter no máximo 40 caracteres.";
  if (!/^[\p{L}\p{N}][\p{L}\p{N}' .-]*$/u.test(nome)) {
    return "Use apenas letras, números, espaços, hífen e apóstrofo no nome do pet.";
  }
  return "";
}

export function validarRaca(valor) {
  const raca = normalizarEspacos(valor);
  if (!raca) return "";
  if (raca.length > 40) return "A raça deve ter no máximo 40 caracteres.";
  if (!/^\p{L}[\p{L}' ().-]*$/u.test(raca)) {
    return "Use apenas letras, espaços e hífen na raça.";
  }
  return "";
}

// ---------- Datas ----------

// Nascimento opcional: não pode ser futuro nem de mais de 40 anos atrás.
export function limitesNascimentoPet() {
  const hoje = new Date();
  const max = hoje.toLocaleDateString("en-CA");
  const min = `${hoje.getFullYear() - 40}-01-01`;
  return { min, max };
}

export function validarNascimento(valor) {
  if (!valor) return "";
  const { min, max } = limitesNascimentoPet();
  if (valor > max) return "A data de nascimento não pode ser no futuro.";
  if (valor < min) return "Data de nascimento muito antiga. Confira o ano.";
  return "";
}

// ---------- Textos livres ----------

export function validarTexto(valor, { rotulo, minimo = 0, maximo, obrigatorio = false }) {
  const texto = (valor ?? "").trim();
  if (!texto) return obrigatorio ? `Preencha ${rotulo}.` : "";
  if (texto.length < minimo) return `${rotulo} deve ter pelo menos ${minimo} caracteres.`;
  if (maximo && texto.length > maximo) return `${rotulo} deve ter no máximo ${maximo} caracteres.`;
  return "";
}

// ---------- Senha ----------

// Senhas que sempre aparecem em listas de vazamentos/dicionários (comparadas sem números e símbolos).
const SENHAS_COMUNS = new Set([
  "password", "senha", "senhasenha", "qwerty", "qwertyuiop", "asdfghjkl", "abcdefgh",
  "iloveyou", "admin", "administrador", "letmein", "welcome", "petcare", "petshop",
  "teste", "mudar", "brasil", "flamengo", "corinthians", "palmeiras", "minhasenha",
]);

export function validarSenha(senha, { email = "", nome = "" } = {}) {
  if (!senha) return "Informe a senha.";
  if (senha.length < SENHA_MINIMA) {
    return `A senha deve ter pelo menos ${SENHA_MINIMA} caracteres. Dica: use uma frase longa.`;
  }
  if (senha.length > SENHA_MAXIMA) return `A senha deve ter no máximo ${SENHA_MAXIMA} caracteres.`;

  const minuscula = senha.toLowerCase();

  if (new Set(minuscula).size <= 3) {
    return "Senha muito repetitiva. Use uma frase ou palavras diferentes.";
  }
  if (/^(0123456789|1234567890|123456789|abcdefghij|qwertyuiop)/.test(minuscula)) {
    return "Senha muito previsível (sequência comum). Escolha outra.";
  }

  const soLetras = minuscula.replace(/[^a-zà-ÿ]/g, "");
  if (SENHAS_COMUNS.has(soLetras)) return "Esta senha é muito comum. Escolha outra.";

  const parteEmail = email.split("@")[0].toLowerCase();
  const primeiroNome = nome.trim().split(" ")[0].toLowerCase();
  if (parteEmail.length >= 4 && minuscula.includes(parteEmail)) {
    return "A senha não deve conter o seu e-mail.";
  }
  if (primeiroNome.length >= 4 && minuscula.includes(primeiroNome)) {
    return "A senha não deve conter o seu nome.";
  }

  return "";
}

// Há algum erro? (objeto { campo: "mensagem" })
export function temErros(erros) {
  return Object.values(erros).some(Boolean);
}
