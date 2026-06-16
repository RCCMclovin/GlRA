import { SeverityBadge, StatusBadge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import type { Finding, Project, User, View } from '../types';

type ProjectDetailsProps = {
  project?: Project;
  findings: Finding[];
  users: User[];
  onNavigate: (view: View) => void;
  onOpenFinding: (findingId: string) => void;
};

export function ProjectDetails({ project, findings, users, onNavigate, onOpenFinding }: ProjectDetailsProps) {
  if (!project) {
    return (
      <section className="empty-state">
        <h1>Projeto não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('projects')}>Voltar para projetos</button>
      </section>
    );
  }

  const owner = users.find((user) => user.id === project.ownerId);
  const participants = users.filter((user) => project.participantIds.includes(user.id));
  const projectFindings = findings.filter((finding) => finding.projectId === project.id);
  const critical = projectFindings.filter((finding) => finding.severity === 'Crítica').length;
  const open = projectFindings.filter((finding) => finding.status === 'Aberto').length;
  const fixed = projectFindings.filter((finding) => finding.status === 'Corrigido').length;

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">{project.id}</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={() => onNavigate('projects')}>Voltar</button>
          <button className="ghost-button" onClick={() => onNavigate('edit-project')}>Editar projeto</button>
          <button className="primary-button" onClick={() => onNavigate('new-finding')}>Novo achado</button>
        </div>
      </header>

      <div className="project-detail-grid">
        <article className="card project-overview-card">
          <h2>Informações do projeto</h2>
          <dl className="definition-list">
            <div><dt>Proprietário</dt><dd>{owner?.name}</dd></div>
            <div><dt>Data de criação</dt><dd>{project.createdAt}</dd></div>
            <div><dt>Participantes</dt><dd>{participants.map((user) => user.name).join(', ')}</dd></div>
          </dl>
        </article>

        <div className="project-stats-row">
          <StatCard label="Achados" value={projectFindings.length} hint="Total do projeto" />
          <StatCard label="Críticos" value={critical} hint="Prioridade máxima" />
          <StatCard label="Abertos" value={open} hint="Pendentes" />
          <StatCard label="Corrigidos" value={fixed} hint="Remediados" />
        </div>
      </div>

      <article className="card project-findings-card">
        <div className="card-header">
          <div>
            <h2>Achados do projeto</h2>
            <p className="muted-text">Lista de vulnerabilidades vinculadas a este projeto.</p>
          </div>
          <button className="ghost-button" onClick={() => onNavigate('new-finding')}>Cadastrar achado</button>
        </div>

        {projectFindings.length === 0 ? (
          <div className="empty-inline">Nenhum achado registrado para este projeto.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>CWE</th>
                  <th>Severidade</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {projectFindings.map((finding) => {
                  const assignee = users.find((user) => user.id === finding.assigneeId);
                  return (
                    <tr key={finding.id}>
                      <td>{finding.id}</td>
                      <td>{finding.title}</td>
                      <td>{finding.category}</td>
                      <td><SeverityBadge value={finding.severity} /></td>
                      <td><StatusBadge value={finding.status} /></td>
                      <td>{assignee?.name}</td>
                      <td><button className="link-button" onClick={() => onOpenFinding(finding.id)}>Detalhes</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
