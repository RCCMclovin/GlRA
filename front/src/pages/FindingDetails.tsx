import { SeverityBadge, StatusBadge } from '../components/Badge';
import type { Finding, Lookup, Project, User, View } from '../types';

type FindingDetailsProps = {
  finding?: Finding;
  projects: Project[];
  users: User[];
  statuses: Lookup[];
  onUpdateStatus: (findingId: string, statusId: string) => void;
  onNavigate: (view: View) => void;
};

export function FindingDetails({ finding, projects, statuses, onUpdateStatus, onNavigate }: FindingDetailsProps) {
  if (!finding) {
    return (
      <section className="empty-state">
        <h1>Achado não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('findings')}>Voltar para achados</button>
      </section>
    );
  }

  const project = projects.find((item) => item.id === finding.projectId);
  const currentStatusLookup = statuses.find((s) => s.name === finding.status);

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">{finding.id.slice(0, 8)}</span>
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
          <p>{finding.solution}</p>
        </article>

        <aside className="card details-side">
          <h2>Responsabilidade</h2>
          <dl>
            <div><dt>Reportante</dt><dd>{finding.reporter.name}</dd></div>
            <div><dt>Responsável</dt><dd>{finding.assigned.name}</dd></div>
          </dl>
          <label>
            Atualizar status
            <select
              value={currentStatusLookup?.id ?? ''}
              onChange={(e) => onUpdateStatus(finding.id, e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
        </aside>
      </div>
    </section>
  );
}
