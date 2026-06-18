import { useMemo } from 'react';
import { SeverityBadge, StatusBadge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import type { Finding, Project, User, View } from '../types';

type DashboardProps = {
  currentUserId: string;
  findings: Finding[];
  projects: Project[];
  users: User[];
  onNavigate: (view: View) => void;
  onOpenProject: (projectId: string) => void;
  onOpenFinding: (findingId: string) => void;
};

const resolvedStatuses = ['Corrigido', 'Aceito como risco', 'Falso positivo'];
const severityOrder = ['Crítica', 'Alta', 'Média', 'Baixa', 'Informativa'];

function isPending(finding: Finding) {
  return !resolvedStatuses.includes(finding.status);
}

export function Dashboard({ currentUserId, findings, projects, users, onNavigate, onOpenProject, onOpenFinding }: DashboardProps) {
  const currentUser = users.find((user) => user.id === currentUserId);
  const createdByMe = findings.filter((f) => f.reporter.id === currentUserId);
  const assignedToMePending = findings.filter((f) => f.assigned.id === currentUserId && isPending(f));
  const pendingTotal = findings.filter(isPending).length;

  const latestProjects = projects.slice(0, 5);
  const latestAssignedToMe = assignedToMePending.slice(0, 6);

  const projectRows = latestProjects.map((project) => {
    const pf = findings.filter((f) => f.projectId === project.id);
    const pending = pf.filter(isPending).length;
    const role = project.creatorId === currentUserId ? 'Proprietário' : 'Participante';
    return { project, pending, total: pf.length, role };
  });

  const severityDist = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of severityOrder) counts[s] = 0;
    for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
    const max = Math.max(...Object.values(counts), 1);
    return severityOrder.map((name) => ({ name, count: counts[name] || 0, pct: ((counts[name] || 0) / max) * 100 }));
  }, [findings]);

  const statusDist = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) counts[f.status] = (counts[f.status] || 0) + 1;
    const total = findings.length || 1;
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }));
  }, [findings]);

  const projectRisk = useMemo(() => {
    return projects.map((p) => {
      const pf = findings.filter((f) => f.projectId === p.id);
      const critical = pf.filter((f) => f.severity === 'Crítica').length;
      const high = pf.filter((f) => f.severity === 'Alta').length;
      const open = pf.filter(isPending).length;
      return { project: p, total: pf.length, critical, high, open };
    }).sort((a, b) => (b.critical * 10 + b.high) - (a.critical * 10 + a.high));
  }, [projects, findings]);

  return (
    <section>
      <header className="page-header dashboard-header">
        <div>
          <span className="eyebrow">Painel do usuário logado</span>
          <h1>Dashboard</h1>
          <p>Visão geral de {currentUser?.name ?? 'usuário'}: projetos, achados e métricas de segurança.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('new-finding')}>Registrar achado</button>
      </header>

      <div className="stats-grid dashboard-stats">
        <StatCard label="Projetos" value={projects.length} hint="Com acesso" />
        <StatCard label="Total de achados" value={findings.length} hint="Todos os projetos" />
        <StatCard label="Pendentes" value={pendingTotal} hint="Aguardando resolução" />
        <StatCard label="Atribuídos a mim" value={assignedToMePending.length} hint="Pendentes p/ resolver" />
      </div>

      <div className="dashboard-grid report-dashboard-grid">
        {/* Severity distribution */}
        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Distribuição por severidade</h2>
              <p className="muted-text">Achados por nível de criticidade.</p>
            </div>
          </div>
          <div className="bar-list">
            {severityDist.map((s) => (
              <div className="bar-row" key={s.name}>
                <span><SeverityBadge value={s.name} /></span>
                <div className="bar-track">
                  <div className="bar-fill severity" style={{ width: `${s.pct}%` }} />
                </div>
                <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </article>

        {/* Status pipeline */}
        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Pipeline de status</h2>
              <p className="muted-text">Distribuição dos achados por status.</p>
            </div>
          </div>
          {statusDist.length === 0 ? (
            <div className="empty-inline">Nenhum achado registrado.</div>
          ) : (
            <div className="bar-list">
              {statusDist.map((s) => (
                <div className="bar-row" key={s.name}>
                  <span><StatusBadge value={s.name} /></span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                  <strong>{s.count}</strong>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="dashboard-grid simple-dashboard-grid">
        {/* My projects table */}
        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Meus projetos</h2>
              <p className="muted-text">Projetos em que participo ou sou proprietário.</p>
            </div>
            <button className="ghost-button" onClick={() => onNavigate('projects')}>Ver todos</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Projeto</th><th>Papel</th><th>Achados</th><th>Pendentes</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {projectRows.map(({ project, role, total, pending }) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{role}</td>
                    <td>{total}</td>
                    <td>{pending}</td>
                    <td><button className="link-button" onClick={() => onOpenProject(project.id)}>Abrir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Assigned to me */}
        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Atribuídos a mim</h2>
              <p className="muted-text">Achados pendentes para resolver.</p>
            </div>
            <button className="ghost-button" onClick={() => onNavigate('findings')}>Ver achados</button>
          </div>
          {latestAssignedToMe.length === 0 ? (
            <div className="empty-inline">Nenhum achado pendente atribuído a você.</div>
          ) : (
            <div className="priority-list compact-list">
              {latestAssignedToMe.map((finding) => {
                const project = projects.find((item) => item.id === finding.projectId);
                return (
                  <button className="priority-item clickable" key={finding.id} onClick={() => onOpenFinding(finding.id)}>
                    <div>
                      <strong>{finding.title}</strong>
                      <span>{finding.id.slice(0, 8)} · {project?.title}</span>
                    </div>
                    <div className="inline-badges">
                      <SeverityBadge value={finding.severity} />
                      <StatusBadge value={finding.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </article>
      </div>

      {/* Project risk overview */}
      {projectRisk.length > 0 && (
        <article className="card dashboard-card" style={{ marginTop: 18 }}>
          <div className="card-header">
            <div>
              <h2>Risco por projeto</h2>
              <p className="muted-text">Visão geral de achados críticos e pendentes por projeto.</p>
            </div>
          </div>
          <div className="project-risk-list">
            {projectRisk.map(({ project, total, critical, high, open }) => (
              <button className="project-risk-row" key={project.id} onClick={() => onOpenProject(project.id)} style={{ cursor: 'pointer', textAlign: 'left', background: 'var(--surface-2)', width: '100%' }}>
                <div>
                  <strong>{project.title}</strong>
                  <span>{total} achado{total !== 1 ? 's' : ''} · {open} pendente{open !== 1 ? 's' : ''}</span>
                </div>
                <div className="risk-pills">
                  {critical > 0 && <span style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>{critical} crítico{critical !== 1 ? 's' : ''}</span>}
                  {high > 0 && <span style={{ borderColor: '#b86d43', color: '#b86d43' }}>{high} alto{high !== 1 ? 's' : ''}</span>}
                  {critical === 0 && high === 0 && <span>Sem alto risco</span>}
                </div>
              </button>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
