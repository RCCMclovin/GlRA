import type { Finding, Notification, Project, User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Larissa de Andrade Silva', email: 'larissa@gira.local' },
  { id: 'u2', name: 'Gabriel Toledano Feitosa', email: 'gabriel@gira.local' },
  { id: 'u3', name: 'João Alfredo Holanda Bessa Neto', email: 'joao@gira.local' },
  { id: 'u4', name: 'Rafael Castilho Carvalho', email: 'rafael@gira.local' }
];

export const projects: Project[] = [
  {
    id: 'PJT-001',
    title: 'Portal Acadêmico',
    description: 'Aplicação web usada para demonstração de análise de segurança aplicada.',
    createdAt: '2026-06-16',
    ownerId: 'u1',
    participantIds: ['u1', 'u2', 'u3']
  },
  {
    id: 'PJT-002',
    title: 'API Interna',
    description: 'API de cadastro e consulta de informações internas para teste controlado.',
    createdAt: '2026-06-16',
    ownerId: 'u4',
    participantIds: ['u1', 'u4']
  }
];

export const findings: Finding[] = [
  {
    id: 'ACH-001',
    projectId: 'PJT-001',
    title: 'SQL Injection em parâmetro de busca',
    description: 'Entrada de usuário utilizada diretamente em consulta SQL sem parametrização adequada.',
    createdAt: '2026-06-16',
    reporterId: 'u1',
    severity: 'Crítica',
    status: 'Aberto',
    remediation: 'Utilizar consultas parametrizadas e validar entradas no backend.',
    evidenceUrl: 'evidencias/sql-injection.png',
    assigneeId: 'u4',
    category: 'CWE-89'
  },
  {
    id: 'ACH-002',
    projectId: 'PJT-001',
    title: 'Ausência de proteção CSRF',
    description: 'Formulário sensível não apresenta token anti-CSRF.',
    createdAt: '2026-06-16',
    reporterId: 'u2',
    severity: 'Alta',
    status: 'Em análise',
    remediation: 'Implementar token CSRF e validar origem da requisição.',
    evidenceUrl: 'evidencias/csrf.png',
    assigneeId: 'u3',
    category: 'CWE-352'
  },
  {
    id: 'ACH-003',
    projectId: 'PJT-002',
    title: 'Log com informação sensível',
    description: 'Logs armazenam dados que não deveriam ser persistidos em texto claro.',
    createdAt: '2026-06-16',
    reporterId: 'u4',
    severity: 'Média',
    status: 'Em correção',
    remediation: 'Remover dados sensíveis do log e revisar política de logging.',
    evidenceUrl: 'evidencias/logging.png',
    assigneeId: 'u4',
    category: 'CWE-532'
  }
];

export const notifications: Notification[] = [
  {
    id: 'N-001',
    projectId: 'PJT-001',
    message: 'Novo achado crítico registrado no Portal Acadêmico.',
    createdAt: '2026-06-16',
    read: false
  },
  {
    id: 'N-002',
    projectId: 'PJT-002',
    message: 'Status do achado ACH-003 alterado para Em correção.',
    createdAt: '2026-06-16',
    read: true
  }
];
