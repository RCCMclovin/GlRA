<div align="center">

# GlRA — Gestão de Achados de Segurança

  ![Trilha](https://img.shields.io/badge/Trilha-VulnCase-3F9B63?style=for-the-badge)
  ![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-4F74E8?style=for-the-badge)
  ![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-172433?style=for-the-badge)
  ![Banco](https://img.shields.io/badge/Persistência-Prisma%20%2B%20MySQL-C78E18?style=for-the-badge)

  Ferramenta acadêmica para cadastro, organização e acompanhamento de achados de segurança em projetos.
</div>

 ---

## Sumário

- [1. Nome da ferramenta](#1-nome-da-ferramenta)
- [2. Integrantes da equipe](#2-integrantes-da-equipe)
- [3. Trilha escolhida](#3-trilha-escolhida)
- [4. Foco da ferramenta](#4-foco-da-ferramenta)
- [5. Descrição resumida da solução](#5-descrição-resumida-da-solução)
- [6. Funcionalidades implementadas](#6-funcionalidades-implementadas)
- [7. Arquitetura geral e módulos principais](#7-arquitetura-geral-e-módulos-principais)
- [8. Fluxo principal de uso](#8-fluxo-principal-de-uso)
- [9. Tecnologias utilizadas](#9-tecnologias-utilizadas)
- [10. Execução com Docker (recomendado)](#10-execução-com-docker-recomendado)
- [11. Execução manual (desenvolvimento)](#11-execução-manual-desenvolvimento)
- [12. Documentação da API (Swagger)](#12-documentação-da-api-swagger)
- [13. Endpoints da API](#13-endpoints-da-api)
- [14. Credenciais padrão](#14-credenciais-padrão)
- [15. Limitações atuais](#15-limitações-atuais)
- [16. Possibilidades de evolução futura](#16-possibilidades-de-evolução-futura)
- [17. Link do repositório final](#17-link-do-repositório-final)

 ---

## 1. Nome da ferramenta

- GlRA

A ferramenta foi desenvolvida no contexto do **Projeto Integrador**, dentro da trilha **VulnCase**.

 ---

## 2. Integrantes da equipe

| Integrante | Responsabilidade principal |
| --- | --- |
| Gabriel Toledano Feitosa | Frontend e integração |
| João Alfredo Holanda Bessa Neto | Frontend, integração e documentação |
| Larissa de Andrade Silva | Frontend e documentação |
| Rafael Castilho Carvalho | Backend e pipeline para deployment |

 ---

## 3. Trilha escolhida

- Trilha 3 — VulnCase

A trilha escolhida tem como foco o desenvolvimento de uma ferramenta para organização, acompanhamento e gestão de achados de segurança.

 ---

## 4. Foco da ferramenta

O foco do **GlRA** é apoiar a gestão de achados de segurança em projetos pequenos, ambientes acadêmicos, laboratórios, aplicações em avaliação ou ativos analisados em atividades de segurança aplicada.

O **GlRA** busca resolver a dispersão de achados oferecendo uma base de sistema para:

- cadastrar projetos;
- registrar achados de segurança;
- classificar severidade;
- acompanhar status;
- definir responsáveis;
- documentar propostas de remediação;
- acompanhar notificações relacionadas aos projetos.

 ---

## 5. Descrição resumida da solução

O **GlRA** é uma aplicação web full-stack composta por:

- **Frontend** em React + TypeScript (Vite), conectado ao backend via API REST;
- **Backend** em Node.js + Express + TypeScript, com autenticação por sessão, validação, rate limiting e documentação Swagger;
- **Banco de dados** MySQL com ORM Prisma;
- **Docker Compose** para orquestração completa (MySQL + backend + frontend com nginx).

 ---

## 6. Funcionalidades implementadas

### 6.1 Frontend (conectado ao backend)

- Tela de login e cadastro de conta com autenticação real via API;
- Persistência de sessão (recarregar a página mantém o login);
- Dashboard do usuário com gráficos de distribuição por severidade, pipeline de status e risco por projeto;
- Listagem, cadastro e edição de projetos;
- Detalhes de projeto com gestão de participantes (busca e autocomplete de usuários);
- Gráficos donut (severidade) e ring (% resolvido) por projeto;
- Listagem, cadastro e edição de achados com filtros (título, severidade, status, usuário);
- Detalhes do achado com atualização de status;
- Seção de anexos/evidências com upload de imagens, visualização em miniatura e preview em tela cheia;
- Exibição de severidade, status, categoria CWE, responsável;
- Cadastro de usuários com validação;
- Notificações com marcação de leitura e exclusão;
- Todas as operações CRUD conectadas à API REST.

### 6.2 Backend

- Autenticação com sessão (signup, login, logout, verificação de sessão via `/auth/me`);
- CRUD completo de projetos com busca por título;
- CRUD completo de achados com notificações automáticas e validação Joi;
- Busca avançada de achados (por título, severidade, status, categoria, responsável, reportante);
- Controle de acesso a projetos (participantes);
- CRUD de usuários com busca por nome/e-mail;
- Listagem de severidades, status e categorias (em português);
- Upload, listagem e exclusão de mídias/evidências vinculadas a achados;
- Notificações automáticas;
- Rate limiting e segurança com Helmet;
- Validação de dados com Joi;
- Documentação Swagger automática (regenerada no build).

### 6.3 Persistência

A persistência utiliza **Prisma** com **MySQL**, contemplando as entidades: usuário, projeto, acesso ao projeto, achado, tipo/categoria, severidade, status, mídia/evidência e notificação.

 ---

## 7. Arquitetura geral e módulos principais

```text
GlRA-main/
├── back/                      # Backend da aplicação
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de dados
│   │   ├── migrations/         # Migrações do banco
│   │   └── seed.ts             # Dados iniciais
│   ├── src/
│   │   ├── resources/          # Módulos (auth, finding, project, user, etc.)
│   │   ├── router/             # Rotas da API
│   │   ├── middlewares/        # isAuth, hasAccess, validate, etc.
│   │   ├── swagger.ts          # Geração da documentação
│   │   └── index.ts            # Ponto de entrada
│   ├── Dockerfile
│   ├── docker-entrypoint.sh    # Script de inicialização Docker
│   └── .env.example
│
├── front/                     # Frontend da aplicação
│   ├── src/
│   │   ├── api.ts              # Camada de serviço (chamadas à API)
│   │   ├── types.ts            # Tipagens TypeScript
│   │   ├── App.tsx             # Roteamento e estado global
│   │   ├── components/         # Layout, Badge, StatCard
│   │   └── pages/              # Login, Dashboard, Projects, Findings, etc.
│   ├── nginx.conf              # Configuração nginx (proxy reverso)
│   ├── vite.config.ts          # Proxy para desenvolvimento
│   └── Dockerfile
│
├── docker-compose.yml         # Orquestração: MySQL + Backend + Frontend
└── README.md
```

 ---

## 8. Fluxo principal de uso

1. O usuário acessa a aplicação (`http://localhost:3001`);
2. Realiza login com e-mail e senha;
3. O dashboard exibe projetos, achados cadastrados e achados pendentes;
4. O usuário pode criar projetos e registrar achados;
5. Achados recebem: título, descrição, severidade, status, categoria CWE, responsável e proposta de remediação;
6. Notificações são geradas automaticamente ao criar/editar achados;
7. O responsável acompanha e atualiza o status da remediação.

 ---

## 9. Tecnologias utilizadas

### Frontend

- React 19 + TypeScript
- Vite (build e dev server com proxy)
- Lucide React (ícones)
- CSS customizado (design system)

### Backend

- Node.js + Express + TypeScript
- Prisma ORM
- Express Session (autenticação)
- BcryptJS (hash de senhas)
- Helmet (segurança HTTP)
- Express Rate Limit
- Joi (validação)
- Swagger UI Express + Swagger Autogen
- Multer (upload de arquivos)

### Infraestrutura

- MySQL 8.0
- Docker + Docker Compose
- Nginx (proxy reverso no frontend)

 ---

## 10. Execução com Docker (recomendado)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Executar

```bash
docker compose up --build
```

Isso inicia automaticamente:

| Serviço | URL | Descrição |
| --- | --- | --- |
| **Frontend** | <http://localhost:3001> | Interface web (nginx + React) |
| **Backend** | <http://localhost:3333> | API REST |
| **Swagger** | <http://localhost:3001/api> | Documentação interativa da API |
| **MySQL** | localhost:3306 | Banco de dados |

O backend executa automaticamente:

1. Aguarda o MySQL ficar disponível;
2. Executa as migrações do Prisma;
3. Popula o banco com dados iniciais (seed);
4. Inicia o servidor.

### Parar

```bash
docker compose down
```

### Limpar dados do banco

```bash
docker compose down -v
```

 ---

## 11. Execução manual (desenvolvimento)

### 11.1 Banco de dados

Certifique-se de ter um MySQL rodando. Pode usar Docker apenas para o banco:

```bash
docker run -d --name gira-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=gira \
  -e MYSQL_USER=gira \
  -e MYSQL_PASSWORD=gira123 \
  -p 3306:3306 \
  mysql:8.0
```

### 11.2 Backend

```bash
cd back
cp .env.example .env    # ajuste as variáveis se necessário
npm install
npx prisma migrate dev  # criar tabelas
npx ts-node prisma/seed.ts  # popular dados iniciais
npm start               # inicia com nodemon (dev)
```

O backend estará disponível em `http://localhost:3333`.

### 11.3 Frontend

```bash
cd front
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` com proxy automático para o backend.

---

## 12. Documentação da API (Swagger)

A documentação interativa da API está disponível em:

- **Via Docker:** <http://localhost:3001/api> (proxy pelo nginx)
- **Direto no backend:** <http://localhost:3333/api>

O Swagger documenta todos os endpoints, parâmetros, schemas e respostas da API.

Para regenerar a documentação após alterações:

```bash
cd back
npm run swagger
```

 ---

## 13. Endpoints da API

Todos os endpoints estão sob o prefixo `/v1/`.

### Autenticação

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/v1/auth/signup` | Cadastro de usuário (com auto-login) |
| POST | `/v1/auth/login` | Login (retorna dados do usuário) |
| POST | `/v1/auth/logout` | Logout |
| GET | `/v1/auth/me` | Dados do usuário logado (persistência de sessão) |

### Projetos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/project` | Listar projetos do criador |
| POST | `/v1/project` | Criar projeto |
| POST | `/v1/project/search` | Buscar projetos por título |
| GET | `/v1/project/:id` | Detalhes do projeto |
| PUT | `/v1/project/:id` | Atualizar projeto |
| DELETE | `/v1/project/:id` | Remover projeto |

### Acesso a Projetos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/projectAccess` | Projetos com acesso |
| GET | `/v1/projectAccess/:projectId` | Usuários do projeto |
| POST | `/v1/projectAccess/p/:projectId/u/:userId` | Conceder acesso |
| DELETE | `/v1/projectAccess/p/:projectId/u/:userId` | Revogar acesso |

### Achados

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/finding/p/:projectId` | Achados do projeto |
| POST | `/v1/finding/search/:projectId` | Buscar achados (título, severidade, status, responsável, reportante, categoria) |
| GET | `/v1/finding/:id` | Detalhes do achado |
| POST | `/v1/finding` | Criar achado |
| PUT | `/v1/finding/:id` | Atualizar achado |
| DELETE | `/v1/finding/:id` | Remover achado |

### Lookups

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/findingSeverity` | Listar severidades |
| GET | `/v1/findingStatus` | Listar status |
| GET | `/v1/findingTypes` | Listar categorias CWE |

### Usuários

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/user` | Listar todos os usuários |
| POST | `/v1/user` | Criar usuário |
| POST | `/v1/user/search` | Buscar usuários por nome ou e-mail |
| GET | `/v1/user/:id` | Detalhes do usuário |
| GET | `/v1/user/checkemail/:email` | Verificar se e-mail já existe |
| PUT | `/v1/user/:id` | Atualizar usuário (próprio) |
| DELETE | `/v1/user/:id` | Remover usuário (próprio) |

### Notificações

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/v1/notification` | Listar notificações |
| PUT | `/v1/notification/:id` | Alternar lido/não lido |
| DELETE | `/v1/notification/:id` | Remover notificação |

### Mídias/Evidências

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/v1/media` | Upload de mídia |
| POST | `/v1/media/:findingId` | Upload vinculado a achado |
| GET | `/v1/media/:id` | Download de mídia |
| GET | `/v1/media/index/:findingId` | Listar mídias do achado |
| DELETE | `/v1/media/:id` | Remover mídia |

 ---

## 14. Credenciais padrão

O seed cria automaticamente um usuário administrador:

| Campo | Valor |
| --- | --- |
| **E-mail** | `admin@gira.com` |
| **Senha** | `123456` |

Novos usuários podem ser cadastrados via:

- Tela de usuários no frontend;
- Endpoint `POST /v1/auth/signup`;
- Endpoint `POST /v1/user`.

 ---

## 15. Limitações atuais

- Não há geração de relatórios em formato exportável;
- Não há exportação dos achados em PDF, CSV ou outro formato;
- O upload de evidências aceita apenas imagens (não suporta PDFs ou outros formatos).

 ---

## 16. Possibilidades de evolução futura

- Implementar relatórios de achados por projeto;
- Permitir exportação em PDF, CSV ou Markdown;
- Criar histórico de alterações dos achados (auditoria);
- Associar achados a referências como CWE, OWASP Top 10 e CVE;
- Suportar upload de documentos além de imagens (PDF, DOCX);
- Criar um agente assistivo para sugerir correções e investigações.

 ---

## 17. Link do repositório final

Repositório final do projeto:

**<https://github.com/RCCMclovin/GlRA>**

 ---
