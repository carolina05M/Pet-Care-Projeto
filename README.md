# 🐾 PetCare — Cuidado, carinho e praticidade para o seu pet!

Uma plataforma web desenvolvida para conectar tutores aos cuidados que seus pets merecem, oferecendo praticidade na compra de produtos, agendamento de serviços e gerenciamento de um petshop.

---

## 📋 Sobre o Projeto

O **PetCare** é uma aplicação web desenvolvida com o objetivo de modernizar e facilitar a experiência de tutores de animais de estimação e a administração de petshops.

A plataforma reúne, em um único ambiente digital, funcionalidades de loja virtual, catálogo de serviços e sistema de agendamentos, proporcionando uma navegação intuitiva, organizada e acessível.

Além da experiência voltada aos clientes, o projeto também contempla uma área administrativa para acompanhamento e gerenciamento das atividades do estabelecimento, com integração ao banco de dados em nuvem.

## 🎯 Objetivos

- Desenvolver uma plataforma digital voltada ao universo pet.
- Facilitar o acesso a produtos e serviços para animais de estimação.
- Implementar um catálogo dinâmico integrado ao banco de dados.
- Desenvolver um sistema de agendamentos com diferentes modalidades de atendimento.
- Permitir a gestão de informações por meio de uma área administrativa.
- Aplicar conceitos de desenvolvimento web, componentização e responsividade.
- Integrar o front-end a uma solução moderna de backend e banco de dados.

## ✨ Funcionalidades

### 🏠 Página Inicial
- Apresentação da identidade visual do PetCare.
- Destaques dos produtos e serviços.
- Navegação intuitiva entre as páginas.

### 🛍️ Produtos
- Listagem dinâmica de produtos cadastrados no Supabase.
- Pesquisa em tempo real por nome.
- Exibição de preços e informações dos produtos.
- Carregamento condicional de imagens.
- Seleção de quantidade e interação com o carrinho.

### 🛒 Carrinho e Entrega
- Adição e acompanhamento de produtos selecionados.
- Contador de itens no carrinho.
- Interface para organização da compra.
- Opções de entrega conforme a implementação da aplicação.

### 🐶 Serviços
- Listagem dinâmica dos serviços disponíveis.
- Exibição de informações e duração dos procedimentos.
- Identificação visual por ícones.
- Serviços como banho, banho e tosa, corte de unhas, hidratação, escovação e dia de cuidados.

### 📅 Sistema de Agendamentos
- Formulário integrado ao Supabase.
- Cadastro do nome completo do tutor.
- Registro de telefone ou WhatsApp.
- Identificação do pet.
- Seleção de data e horário.
- Escolha entre levar o pet até a loja ou solicitar a busca em domicílio.
- Exibição condicional do campo de endereço quando necessário.
- Armazenamento dos agendamentos no banco de dados.

### ⚙️ Painel Administrativo
Área destinada ao gerenciamento do petshop, planejada para centralizar informações importantes, como:

- Visualização dos agendamentos.
- Consulta dos dados dos tutores e seus pets.
- Acompanhamento das datas e horários.
- Consulta das modalidades de atendimento.
- Gerenciamento das informações do estabelecimento.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| React | Construção da interface e componentes reutilizáveis |
| Vite | Ambiente de desenvolvimento e compilação |
| JavaScript (ES6+) | Lógica e interatividade |
| CSS3 | Estilização e responsividade |
| Supabase | Backend, banco de dados PostgreSQL e integração de dados |
| Git | Controle de versão |
| GitHub | Hospedagem do código e colaboração |

## 🗄️ Banco de Dados

O projeto utiliza o **Supabase** como solução de backend e armazenamento de dados.

Principais tabelas implementadas:

- `produtos` — armazenamento das informações dos produtos.
- `servicos` — cadastro dos serviços oferecidos.
- `agendamentos` — registro das solicitações de atendimento.

A aplicação utiliza políticas de segurança em nível de linha (RLS), configuradas para controlar o acesso aos dados.

## 🎨 Identidade Visual

A identidade visual do PetCare foi desenvolvida para transmitir acolhimento, confiança, carinho e bem-estar animal.

A paleta de cores utiliza tons terrosos e suaves:

| Cor | Código | Aplicação |
|---|---|---|
| Marrom escuro | `#4B2D27` | Cabeçalhos e textos principais |
| Bege claro | `#F6F0E8` | Fundos e áreas de conteúdo |
| Caramelo/Terracota | `#BD855D` | Botões, destaques e elementos interativos |

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Um editor de código, como o [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/carolina05M/Pet-Care-Projeto.git
```

### 2. Entre na pasta do projeto

```bash
cd Pet-Care-Projeto
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICAVEL
```

Substitua os valores pelos dados do seu próprio projeto Supabase.

**Importante:** não compartilhe chaves secretas nem envie arquivos `.env` com credenciais para o GitHub.

### 5. Inicie a aplicação

```bash
npm run dev
```

O Vite disponibilizará um endereço local para acessar a aplicação pelo navegador.

## 📁 Estrutura do Projeto

Estrutura geral esperada de uma aplicação React com Vite:

```text
PetCare/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

*Observação: a estrutura acima é ilustrativa e pode variar conforme a organização atual dos arquivos do projeto.*

## 📚 Aprendizados e Desenvolvimento Acadêmico

O desenvolvimento do PetCare representa a aplicação prática dos conhecimentos adquiridos no curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

Durante o projeto, são trabalhados conceitos como:

- Desenvolvimento de interfaces com React.
- Criação e reutilização de componentes.
- Gerenciamento de estados e eventos.
- Integração entre front-end e banco de dados.
- Operações de cadastro e consulta de informações.
- Organização de código e versionamento com Git e GitHub.
- Experiência do usuário e design responsivo.

## 💚 Considerações Finais

O PetCare busca oferecer uma solução digital que simplifique a rotina dos tutores e contribua para a organização e eficiência dos petshops.

Mais do que uma aplicação web, o projeto representa uma oportunidade de transformar conhecimentos acadêmicos em uma solução prática, aproximando tecnologia, inovação e cuidado animal.

---

<div align="center">

### 🐾 PetCare

**Todo pet merece cuidado, carinho e amor!**

Projeto acadêmico — Curso de Análise e Desenvolvimento de Sistemas (ADS).

</div>
