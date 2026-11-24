
# 🐾 PetCare — Cuidado, carinho e praticidade para o seu pet!

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Uma plataforma web desenvolvida para conectar tutores aos cuidados que seus pets merecem, oferecendo praticidade no acesso a produtos, agendamento de serviços e gerenciamento de um petshop.

---

## 📖 Sobre o Projeto

O **PetCare** é uma aplicação web desenvolvida com o objetivo de modernizar e facilitar a experiência de tutores de animais de estimação e a administração de petshops.

A plataforma reúne, em um único ambiente digital, um catálogo de produtos e serviços, um sistema de agendamentos, uma área exclusiva para clientes e um painel administrativo integrado ao banco de dados.

Desenvolvido com **React, Vite e Supabase**, o projeto busca oferecer uma experiência intuitiva, responsiva, organizada e segura, aplicando boas práticas de desenvolvimento web e arquitetura de software.

## 📑 Sumário

- [Objetivos](#-objetivos)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Estrutura](#-arquitetura-e-estrutura)
- [Banco de Dados](#-banco-de-dados)
- [Segurança](#-segurança)
- [Identidade Visual](#-identidade-visual)
- [Como Executar](#-como-executar)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Deploy](#-deploy)
- [Desenvolvimento Acadêmico](#-desenvolvimento-acadêmico)

## 🎯 Objetivos

- Desenvolver uma plataforma digital voltada ao universo pet.
- Facilitar o acesso a produtos e serviços para animais de estimação.
- Centralizar o gerenciamento de pets e agendamentos.
- Oferecer ferramentas administrativas para a gestão do estabelecimento.
- Implementar autenticação e controle de acesso por perfil.
- Integrar o front-end a um banco de dados em nuvem.
- Aplicar conceitos de componentização, modularização e responsividade.
- Promover boas práticas de segurança, manutenção e organização do código.

## 🚀 Funcionalidades

### 🌐 Área Pública

Disponível para todos os visitantes da plataforma.

- Página inicial com apresentação do PetCare.
- Catálogo dinâmico de produtos e serviços.
- Pesquisa e filtragem de itens.
- Páginas individuais com detalhes de produtos e serviços.
- Exibição de preços e informações dos serviços.
- Página institucional.
- Formulário de contato integrado ao banco de dados.
- Interface responsiva.

### 👤 Área do Cliente

Disponível para usuários autenticados.

- Cadastro e login de usuários.
- Gerenciamento de informações pessoais.
- Cadastro, edição e gerenciamento dos próprios pets.
- Solicitação de agendamentos.
- Seleção de serviços, datas e horários.
- Acompanhamento dos próximos atendimentos.
- Histórico de agendamentos.
- Cancelamento de agendamentos.
- Controle de acesso aos próprios dados.

### 📅 Sistema de Agendamentos

O sistema permite organizar os atendimentos do estabelecimento, relacionando clientes, pets e serviços.

- Identificação do tutor e do pet.
- Seleção do serviço desejado.
- Escolha de data e horário.
- Modalidades de atendimento.
- Registro das informações no Supabase.
- Acompanhamento da situação do agendamento.
- Validação das informações fornecidas.

### ⚙️ Painel Administrativo

Área restrita aos administradores autorizados.

| Módulo | Funcionalidade |
|---|---|
| Dashboard | Indicadores e acompanhamento das atividades |
| Agendamentos | Consulta, confirmação, conclusão e cancelamento |
| Serviços | Cadastro, consulta, edição e gerenciamento |
| Produtos | Gerenciamento do catálogo de produtos |
| Categorias | Organização dos itens do catálogo |
| Clientes | Consulta e gerenciamento de contas |
| Pets | Consulta dos animais cadastrados |
| Mensagens | Acompanhamento das mensagens recebidas |

## 🛠 Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| React | Construção de interfaces e componentes reutilizáveis |
| Vite | Ambiente de desenvolvimento e compilação |
| JavaScript | Lógica, interatividade e regras de negócio |
| CSS3 | Estilização e responsividade |
| React Router | Navegação e gerenciamento de rotas |
| Supabase | Backend, autenticação e integração de dados |
| PostgreSQL | Banco de dados relacional |
| ESLint | Análise estática e qualidade do código |
| Git | Controle de versão |
| GitHub | Hospedagem do código e colaboração |

## 📁 Arquitetura e Estrutura

O projeto utiliza uma arquitetura modular, com separação de responsabilidades entre interface, autenticação, regras de negócio e acesso ao banco de dados.

```text
Pet-Care-Projeto/
├── public/
├── sql/
│   ├── fase8-validacoes.sql
│   ├── fase8c-seguranca-contas.sql
│   └── fase9-dados-demonstracao.sql
├── src/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── Administrador/
│   │   ├── Contato/
│   │   ├── DetalheProduto/
│   │   ├── DetalheServico/
│   │   ├── Entrar/
│   │   ├── Home/
│   │   ├── MeusAgendamentos/
│   │   ├── MeusPets/
│   │   ├── MinhaConta/
│   │   ├── NaoEncontrado/
│   │   ├── Produtos/
│   │   ├── Servicos/
│   │   └── Sobre/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── config.js
│   ├── main.jsx
│   └── routes.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

### Organização das responsabilidades

| Diretório | Responsabilidade |
|---|---|
| `auth/` | Contexto de autenticação e gerenciamento de sessão |
| `components/` | Componentes reutilizáveis da interface |
| `hooks/` | Consultas, ações e gerenciamento de estados |
| `lib/` | Configuração da integração com o Supabase |
| `pages/` | Páginas públicas, área do cliente e administração |
| `services/` | Operações de acesso ao banco de dados |
| `utils/` | Formatação e validação de informações |
| `sql/` | Scripts complementares do banco de dados |

## 🗄️ Banco de Dados

O PetCare utiliza o **Supabase**, baseado em PostgreSQL, para autenticação, armazenamento e gerenciamento das informações.

### Principais entidades

| Entidade | Finalidade |
|---|---|
| Perfis | Informações dos usuários e permissões |
| Pets | Dados dos animais cadastrados |
| Produtos | Informações do catálogo de produtos |
| Serviços | Serviços oferecidos pelo estabelecimento |
| Categorias | Organização dos itens do catálogo |
| Agendamentos | Registro das solicitações de atendimento |
| Mensagens | Informações enviadas pelo formulário de contato |

### Scripts SQL

O diretório `sql/` contém scripts complementares para evolução do banco de dados.

| Arquivo | Finalidade |
|---|---|
| `fase8-validacoes.sql` | Validação e integridade dos dados |
| `fase8c-seguranca-contas.sql` | Segurança e controle de acesso das contas |
| `fase9-dados-demonstracao.sql` | Dados destinados à demonstração do sistema |

> Os scripts complementares pressupõem a existência de uma estrutura inicial de banco de dados compatível. Revise os scripts e realize um backup antes de aplicá-los. Utilize os dados de demonstração somente em ambientes apropriados.

## 🔐 Segurança

A segurança da aplicação é baseada na autenticação do Supabase, no controle de acesso por perfil e nas políticas de segurança do banco de dados.

Entre os mecanismos adotados estão:

- Autenticação e gerenciamento de sessões.
- Proteção de rotas privadas.
- Separação entre clientes e administradores.
- Políticas de segurança em nível de linha (Row Level Security — RLS).
- Restrição de acesso aos dados de outros clientes.
- Controle de acesso de contas inativas.
- Validação de formulários e informações pessoais.
- Validação de telefone e requisitos de senha.
- Utilização de variáveis de ambiente.

A proteção das informações não deve depender exclusivamente da interface React. As políticas de autorização precisam estar corretamente configuradas no banco de dados.

> **Importante:** nunca utilize a chave `service_role` no front-end nem publique arquivos contendo credenciais privadas.

## 🎨 Identidade Visual

A identidade visual do PetCare foi desenvolvida para transmitir acolhimento, confiança, carinho e bem-estar animal.

A proposta utiliza tons terrosos e suaves, buscando proporcionar uma experiência agradável e intuitiva.

| Cor | Código | Aplicação |
|---|---|---|
| Marrom escuro | `#4B2D27` | Cabeçalhos e textos principais |
| Bege claro | `#F6F0E8` | Fundos e áreas de conteúdo |
| Caramelo/Terracota | `#BD855D` | Botões, destaques e elementos interativos |

A interface valoriza a consistência visual, a organização dos elementos e a adaptação a diferentes tamanhos de tela.

## 💻 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.com/)
- Um editor de código, como o [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/carolina05M/Pet-Care-Projeto.git
```

### 2. Acesse a pasta do projeto

```bash
cd Pet-Care-Projeto
```

### 3. Instale as dependências

```bash
npm ci
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
VITE_MODO_DEMO=false
```

Substitua os valores pelas informações do seu projeto Supabase.

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública utilizada pelo front-end |
| `VITE_MODO_DEMO` | Ativa comportamentos destinados à demonstração |

Mantenha o modo de demonstração desativado em ambientes de produção.

### 5. Configure o banco de dados

Configure um projeto no Supabase com as tabelas, relacionamentos, autenticação e políticas RLS necessários para o funcionamento da aplicação.

Os scripts complementares estão disponíveis no diretório `sql/` e devem ser revisados antes da execução.

### 6. Inicie a aplicação

```bash
npm run dev
```

Acesse pelo navegador:

http://localhost:5173

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm ci` | Instala as dependências conforme o arquivo de lock |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run lint` | Analisa a qualidade do código |
| `npm run build` | Gera a versão de produção |

## 🧭 Rotas da Aplicação

### Rotas públicas

| Rota | Página |
|---|---|
| `/` | Página inicial |
| `/sobre` | Sobre o PetCare |
| `/produtos` | Catálogo de produtos |
| `/produtos/:id` | Detalhes do produto |
| `/servicos` | Catálogo de serviços |
| `/servicos/:id` | Detalhes do serviço |
| `/contato` | Contato |
| `/entrar` | Autenticação |

### Rotas do cliente

| Rota | Página |
|---|---|
| `/minha-conta` | Perfil do cliente |
| `/meus-pets` | Gerenciamento de pets |
| `/meus-agendamentos` | Próximos agendamentos |
| `/meus-agendamentos/historico` | Histórico de atendimentos |

### Rotas administrativas

| Rota | Página |
|---|---|
| `/administrador` | Dashboard |
| `/administrador/agendamentos` | Gestão de agendamentos |
| `/administrador/servicos` | Gestão de serviços |
| `/administrador/produtos` | Gestão de produtos |
| `/administrador/categorias` | Gestão de categorias |
| `/administrador/clientes` | Gestão de clientes |
| `/administrador/pets` | Consulta de pets |
| `/administrador/mensagens` | Caixa de mensagens |

## ☁️ Deploy

A aplicação pode ser publicada em plataformas compatíveis com React e Vite, como Vercel e Netlify.

Configurações recomendadas:

- Comando de build: `npm run build`.
- Diretório de publicação: `dist`.
- Configuração das variáveis de ambiente.
- Redirecionamento das rotas da SPA para `index.html`.
- Configuração da URL de produção no Supabase, em Authentication → URL Configuration.
- Revisão das políticas de segurança antes da publicação.

## 🎓 Desenvolvimento Acadêmico

O desenvolvimento do PetCare representa a aplicação prática dos conhecimentos adquiridos no curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

Durante o projeto, são trabalhados conceitos como:

- Desenvolvimento front-end.
- Arquitetura e organização de software.
- Componentização e reutilização de código.
- Gerenciamento de estados e eventos.
- Modelagem de banco de dados.
- Operações CRUD.
- Autenticação e autorização.
- Integração entre front-end e backend.
- Segurança e integridade dos dados.
- Experiência do usuário e design responsivo.
- Controle de versão e desenvolvimento colaborativo.

## 🔮 Evoluções Futuras

Possibilidades de aprimoramento do projeto:

- Ampliação dos recursos de comércio eletrônico.
- Integração com meios de pagamento.
- Notificações de agendamentos.
- Relatórios administrativos avançados.
- Ampliação da cobertura de testes automatizados.
- Melhorias contínuas de acessibilidade e desempenho.

---

<div align="center">

**🐾 PetCare**

Cuidado, carinho e praticidade para o seu pet!

Projeto acadêmico — Análise e Desenvolvimento de Sistemas (ADS).

</div>
