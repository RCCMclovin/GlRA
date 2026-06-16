import { SeverityBadge, StatusBadge } from '../components/Badge';
import type { Finding, FindingStatus, Project, User, View } from '../types';

type FindingDetailsProps = {
  finding?: Finding;
  projects: Project[];
  users: User[];
  onUpdateStatus: (id: string, status: FindingStatus) => void;
  onNavigate: (view: View) => void;
};

const statuses: FindingStatus[] = ['Aberto', 'Em análise', 'Em correção', 'Corrigido', 'Aceito como risco', 'Falso positivo'];

export function FindingDetails({ finding, projects, users, onUpdateStatus, onNavigate }: FindingDetailsProps) {
  if (!finding) {
    return (
      <section className="empty-state">
        <h1>Achado não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('findings')}>Voltar para achados</button>
      </section>
    );
  }

  const project = projects.find((item) => item.id === finding.projectId);
  const reporter = users.find((item) => item.id === finding.reporterId);
  const assignee = users.find((item) => item.id === finding.assigneeId);

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">{finding.id}</span>
          <h1>{finding.title}</h1>
          <p>{project?.title}</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={() => onNavigate('findings')}>Voltar</button>
          <button className="primary-button" onClick={() => onNavigate('edit-finding')}>Editar achado</button>
        </div>
      </header>

      <div className="details-grid">
        <article className="card details-main">
          <div className="meta-row">
            <SeverityBadge value={finding.severity} />
            <StatusBadge value={finding.status} />
            <span>{finding.category}</span>
          </div>
          <h2>Descrição</h2>
          <p>{finding.description}</p>
          <h2>Proposta de remediação</h2>
          <p>{finding.remediation}</p>
          <h2>Evidência</h2>
          <p className="evidence-box">{finding.evidenceUrl}</p>
        </article>

        <aside className="card details-side">
          <h2>Responsabilidade</h2>
          <dl>
            <div><dt>Reportante</dt><dd>{reporter?.name}</dd></div>
            <div><dt>Responsável</dt><dd>{assignee?.name}</dd></div>
            <div><dt>Criado em</dt><dd>{finding.createdAt}</dd></div>
          </dl>
          <label>
            Atualizar status
            <select defaultValue={finding.status} onChange={(event) => onUpdateStatus(finding.id, event.target.value as FindingStatus)}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
        </aside>
      </div>
    </section>
  );
}
