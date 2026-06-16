export type Severity = 'Crítica' | 'Alta' | 'Média' | 'Baixa' | 'Informativa';
export type FindingStatus = 'Aberto' | 'Em análise' | 'Em correção' | 'Corrigido' | 'Aceito como risco' | 'Falso positivo';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  ownerId: string;
  participantIds: string[];
};

export type Finding = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  createdAt: string;
  reporterId: string;
  severity: Severity;
  status: FindingStatus;
  remediation: string;
  evidenceUrl: string;
  assigneeId: string;
  category: string;
};

export type Notification = {
  id: string;
  projectId: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type View =
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'new-project'
  | 'edit-project'
  | 'project-details'
  | 'findings'
  | 'new-finding'
  | 'edit-finding'
  | 'finding-details'
  | 'users'
  | 'notifications';
