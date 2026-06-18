# GIRA - Frontend demonstrativo

Protótipo de frontend para a Trilha 3 - VulnCase. Esta versão ainda não está conectada ao backend.

## Escopo desta entrega

- Tela de login simulada
- Dashboard
- Cadastro completo de projetos, com proprietário e participantes
- Visualização de projetos cadastrados
- Tela de abertura/detalhes de projeto com achados vinculados
- Cadastro e listagem de achados
- Detalhes do achado
- Atualização de status em estado local
- Notificações simuladas
- Dados mockados em `src/data/mockData.ts`

## Como executar

```bash
npm install
npm run dev
```

Depois, acesse a URL exibida no terminal.

## Observação

Esta etapa entrega apenas o frontend. A integração com backend, Prisma, MySQL e autenticação real deverá ser feita em etapa posterior.


## Ajustes da versão v4

- Removido o item 'Cadastrar projeto' do menu lateral.
- A criação de projeto permanece acessível na tela Projetos.
- A tela de abertura do projeto foi mantida, com lista de achados vinculados.
- Paleta ajustada para tons pastéis mais coerentes com o protótipo visual.

## Telas consideradas no front completo

- Login
- Dashboard
- Projetos
- Cadastro de projeto
- Edição de projeto
- Abertura/detalhes do projeto com achados vinculados
- Achados
- Cadastro de achado
- Edição de achado
- Detalhes do achado
- Usuários
- Notificações

## Ajustes da versão v11

- Mantidos os blocos superiores definidos pelo usuário.
- Reintroduzidos Status da remediação e Distribuição por severidade, filtrados pelo usuário logado.
- Incluída seção Achados recentes com achados dos projetos em que o usuário participa.

## Ajustes da versão v12

- Removidas as seções Status da remediação, Distribuição por severidade e Achados recentes.
- Dashboard simplificado para: três blocos superiores, Meus projetos e Últimos atribuídos a mim.
