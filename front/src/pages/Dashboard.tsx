import { SeverityBadge, StatusBadge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import type { Finding, FindingStatus, Notification, Project, User, View } from '../types';

type DashboardProps = {
  currentUserId: string;
  findings: Finding[];
  projects: Project[];
  users: User[];
  notifications: Notification[];
  onNavigate: (view: View) => void;
  onOpenProject: (projectId: string) => void;
  onOpenFinding: (findingId: string) => void;
};

const resolvedStatuses: FindingStatus[] = ['Corrigido', 'Aceito como risco', 'Falso positivo'];

function isPending(finding: Finding) {
  return !resolvedStatuses.includes(finding.status);
}

export function Dashboard({ currentUserId, findings, projects, users, onNavigate, onOpenProject, onOpenFinding }: DashboardProps) {
  const currentUser = users.find((user) => user.id === currentUserId);

  const userProjects = projects
    .filter((project) => project.ownerId === currentUserId || project.participantIds.includes(currentUserId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const userProjectIds = new Set(userProjects.map((project) => project.id));
  const createdByMe = findings.filter((finding) => finding.reporterId === currentUserId);
  const assignedToMePending = findings
    .filter((finding) => finding.assigneeId === currentUserId && isPending(finding))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const latestProjects = userProjects.slice(0, 5);
  const latestAssignedToMe = assignedToMePending.slice(0, 6);

  const projectRows = latestProjects.map((project) => {
    const projectFindings = findings.filter((finding) => finding.projectId === project.id);
    const pending = projectFindings.filter(isPending).length;
    const role = project.ownerId === currentUserId ? 'Proprietário' : 'Participante';
    return { project, pending, total: projectFindings.length, role };
  });

  return (
    <section>
      <header className="page-header dashboard-header">
        <div>
          <span className="eyebrow">Painel do usuário logado</span>
          <h1>Dashboard</h1>
          <p>Visão restrita ao usuário {currentUser?.name}: projetos em que participa, achados cadastrados e achados atribuídos para resolver.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('new-finding')}>Registrar achado</button>
      </header>

      <div className="dashboard-explanation">
        <strong>Regra do painel:</strong>
        <span>este dashboard mostra apenas informações relacionadas ao usuário logado.</span>
      </div>

      <div className="stats-grid dashboard-stats user-dashboard-stats">
        <StatCard label="Projetos em que participo" value={userProjects.length} hint="Projetos em que sou proprietário ou participante" />
        <StatCard label="Achados cadastrados por mim" value={createdByMe.length} hint="Achados em que sou reportante/cadastrante" />
        <StatCard label="Atribuídos a mim (pendentes)" value={assignedToMePending.length} hint="Achados que preciso resolver" />
      </div>

      <div className="dashboard-grid simple-dashboard-grid">
        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Meus projetos</h2>
              <p className="muted-text">Últimos projetos em que participo ou sou proprietário.</p>
            </div>
            <button className="ghost-button" onClick={() => onNavigate('projects')}>Ver todos</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Papel</th>
                  <th>Achados</th>
                  <th>Pendentes</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map(({ project, role, total, pending }) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{role}</td>
                    <td>{total}</td>
                    <td>{pending}</td>
                    <td><button className="link-button" onClick={() => onOpenProject(project.id)}>Abrir projeto</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card dashboard-card">
          <div className="card-header">
            <div>
              <h2>Últimos atribuídos a mim</h2>
              <p className="muted-text">Achados pendentes que o usuário logado precisa resolver.</p>
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
                      <span>{finding.id} · {project?.title}</span>
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
    </section>
  );
}
