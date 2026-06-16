import { SeverityBadge, StatusBadge } from '../components/Badge';
import type { Finding, Project, User, View } from '../types';

type FindingsProps = {
  findings: Finding[];
  projects: Project[];
  users: User[];
  onOpenDetails: (id: string) => void;
  onNavigate: (view: View) => void;
};

export function Findings({ findings, projects, users, onOpenDetails, onNavigate }: FindingsProps) {
  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">Achados</span>
          <h1>Achados de segurança</h1>
          <p>Lista de vulnerabilidades registradas no protótipo.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('new-finding')}>Novo achado</button>
      </header>

      <article className="card">
        <div className="filter-row">
          <input placeholder="Buscar por título ou ID" />
          <select defaultValue="Todos"><option>Todos</option><option>Crítica</option><option>Alta</option><option>Média</option></select>
          <select defaultValue="Todos"><option>Todos</option><option>Aberto</option><option>Em análise</option><option>Em correção</option></select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Título</th><th>Projeto</th><th>CWE</th><th>Severidade</th><th>Status</th><th>Responsável</th><th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding) => {
                const project = projects.find((item) => item.id === finding.projectId);
                const assignee = users.find((item) => item.id === finding.assigneeId);
                return (
                  <tr key={finding.id}>
                    <td>{finding.id}</td>
                    <td>{finding.title}</td>
                    <td>{project?.title}</td>
                    <td>{finding.category}</td>
                    <td><SeverityBadge value={finding.severity} /></td>
                    <td><StatusBadge value={finding.status} /></td>
                    <td>{assignee?.name}</td>
                    <td><button className="link-button" onClick={() => onOpenDetails(finding.id)}>Detalhes</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
