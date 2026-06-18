import { useMemo, useState } from 'react';
import { SeverityBadge, StatusBadge } from '../components/Badge';
import type { Finding, Lookup, Project, User, View } from '../types';

type FindingsProps = {
  findings: Finding[];
  projects: Project[];
  users: User[];
  severities: Lookup[];
  statuses: Lookup[];
  onOpenDetails: (id: string) => void;
  onNavigate: (view: View) => void;
};

export function Findings({ findings, projects, users, severities, statuses, onOpenDetails, onNavigate }: FindingsProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !f.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (severityFilter && f.severity !== severityFilter) return false;
      if (statusFilter && f.status !== statusFilter) return false;
      if (userFilter && f.assigned.id !== userFilter && f.reporter.id !== userFilter) return false;
      return true;
    });
  }, [findings, search, severityFilter, statusFilter, userFilter]);

  const hasFilters = search || severityFilter || statusFilter || userFilter;

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">Achados</span>
          <h1>Achados de segurança</h1>
          <p>{filtered.length} achado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}{hasFilters ? ' (filtrado)' : ''}.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('new-finding')}>Novo achado</button>
      </header>

      <article className="card">
        <div className="filter-row-extended">
          <input
            placeholder="Buscar por título ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="">Todas severidades</option>
            {severities.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos status</option>
            {statuses.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="">Todos usuários</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {hasFilters && (
            <button className="ghost-button" onClick={() => { setSearch(''); setSeverityFilter(''); setStatusFilter(''); setUserFilter(''); }}>
              Limpar
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-inline">Nenhum achado encontrado com os filtros selecionados.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Título</th><th>Projeto</th><th>CWE</th><th>Severidade</th><th>Status</th><th>Responsável</th><th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((finding) => {
                  const project = projects.find((item) => item.id === finding.projectId);
                  return (
                    <tr key={finding.id}>
                      <td>{finding.id.slice(0, 8)}</td>
                      <td>{finding.title}</td>
                      <td>{project?.title}</td>
                      <td>{finding.category}</td>
                      <td><SeverityBadge value={finding.severity} /></td>
                      <td><StatusBadge value={finding.status} /></td>
                      <td>{finding.assigned.name}</td>
                      <td><button className="link-button" onClick={() => onOpenDetails(finding.id)}>Detalhes</button></td>
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
