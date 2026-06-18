import { useCallback, useEffect, useMemo, useState } from 'react';
import { SeverityBadge, StatusBadge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import * as api from '../api';
import type { Finding, Project, User, View } from '../types';

type ProjectDetailsProps = {
  project?: Project;
  findings: Finding[];
  users: User[];
  onNavigate: (view: View) => void;
  onOpenFinding: (findingId: string) => void;
};

export function ProjectDetails({ project, findings, users, onNavigate, onOpenFinding }: ProjectDetailsProps) {
  const [participants, setParticipants] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loadingAccess, setLoadingAccess] = useState(false);

  const loadParticipants = useCallback(async () => {
    if (!project) return;
    try {
      setParticipants(await api.getProjectUsers(project.id));
    } catch { /* ignore */ }
  }, [project]);

  useEffect(() => { loadParticipants(); }, [loadParticipants]);

  const participantIds = useMemo(() => new Set(participants.map((p) => p.id)), [participants]);

  const suggestions = useMemo(() => {
    if (searchText.length < 2) return [];
    const q = searchText.toLowerCase();
    return users.filter((u) => !participantIds.has(u.id) && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))).slice(0, 5);
  }, [users, participantIds, searchText]);

  if (!project) {
    return (
      <section className="empty-state">
        <h1>Projeto não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('projects')}>Voltar para projetos</button>
      </section>
    );
  }

  const owner = users.find((user) => user.id === project.creatorId);
  const projectFindings = findings.filter((f) => f.projectId === project.id);
  const critical = projectFindings.filter((f) => f.severity === 'Crítica').length;
  const open = projectFindings.filter((f) => f.status === 'Aberto').length;
  const fixed = projectFindings.filter((f) => f.status === 'Corrigido').length;

  async function handleAddParticipant(userId: string) {
    if (!project) return;
    setLoadingAccess(true);
    try {
      await api.grantAccess(project.id, userId);
      await loadParticipants();
      setSearchText('');
    } catch { /* ignore */ }
    setLoadingAccess(false);
  }

  async function handleRemoveParticipant(userId: string) {
    if (!project || userId === project.creatorId) return;
    setLoadingAccess(true);
    try {
      await api.revokeAccess(project.id, userId);
      await loadParticipants();
    } catch { /* ignore */ }
    setLoadingAccess(false);
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">{project.id.slice(0, 8)}</span>
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
            <div><dt>Proprietário</dt><dd>{owner?.name ?? '—'}</dd></div>
            <div><dt>Data de criação</dt><dd>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</dd></div>
            <div><dt>Participantes</dt><dd>{participants.length}</dd></div>
          </dl>
        </article>

        <div className="project-stats-row">
          <StatCard label="Achados" value={projectFindings.length} hint="Total do projeto" />
          <StatCard label="Críticos" value={critical} hint="Prioridade máxima" />
          <StatCard label="Abertos" value={open} hint="Pendentes" />
          <StatCard label="Corrigidos" value={fixed} hint="Remediados" />
        </div>
      </div>

      {/* Participants */}
      <article className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div>
            <h2>Participantes do projeto</h2>
            <p className="muted-text">Usuários com acesso a este projeto.</p>
          </div>
        </div>

        <div className="participants-grid" style={{ marginBottom: 16 }}>
          {participants.map((user) => (
            <div className="check-row" key={user.id}>
              <span style={{ flex: 1 }}>
                <strong>{user.name}</strong>
                <br /><small style={{ color: 'var(--muted)' }}>{user.email}</small>
              </span>
              {user.id === project.creatorId ? (
                <span className="badge info">Dono</span>
              ) : (
                <button className="link-button" style={{ color: 'var(--red)' }} onClick={() => handleRemoveParticipant(user.id)} disabled={loadingAccess}>
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <label>
            Adicionar participante
            <input
              placeholder="Buscar por nome ou e-mail..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={loadingAccess}
            />
          </label>
          {suggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestions.map((u) => (
                <button key={u.id} className="autocomplete-item" onClick={() => handleAddParticipant(u.id)} disabled={loadingAccess}>
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Severity donut chart */}
      {projectFindings.length > 0 && (
        <article className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div>
              <h2>Visão geral de achados</h2>
              <p className="muted-text">Distribuição de severidade e status deste projeto.</p>
            </div>
          </div>
          <div className="chart-grid">
            <SeverityChart findings={projectFindings} />
            <StatusChart findings={projectFindings} />
          </div>
        </article>
      )}

      {/* Findings table */}
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
                <tr><th>ID</th><th>Título</th><th>CWE</th><th>Severidade</th><th>Status</th><th>Responsável</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {projectFindings.map((finding) => (
                  <tr key={finding.id}>
                    <td>{finding.id.slice(0, 8)}</td>
                    <td>{finding.title}</td>
                    <td>{finding.category}</td>
                    <td><SeverityBadge value={finding.severity} /></td>
                    <td><StatusBadge value={finding.status} /></td>
                    <td>{finding.assigned.name}</td>
                    <td><button className="link-button" onClick={() => onOpenFinding(finding.id)}>Detalhes</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

const sevColors: Record<string, string> = {
  'Crítica': 'var(--red)', 'Alta': 'var(--peach)', 'Média': 'var(--yellow)',
  'Baixa': 'var(--sage)', 'Informativa': 'var(--primary)',
};

function SeverityChart({ findings }: { findings: Finding[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
    const total = findings.length;
    let cumPct = 0;
    const segments = Object.entries(counts).map(([name, count]) => {
      const pct = (count / total) * 100;
      const start = cumPct;
      cumPct += pct;
      return { name, count, pct, start, color: sevColors[name] || '#ccc' };
    });
    return { segments, total };
  }, [findings]);

  const gradient = data.segments.map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(', ');

  return (
    <div className="donut-chart-container">
      <div className="donut-chart" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="donut-hole">
          <strong>{data.total}</strong>
          <span>achados</span>
        </div>
      </div>
      <div className="donut-legend">
        {data.segments.map((s) => (
          <div key={s.name} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span>{s.name}</span>
            <strong>{s.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const resolvedStatuses = ['Corrigido', 'Aceito como risco', 'Falso positivo'];

function StatusChart({ findings }: { findings: Finding[] }) {
  const total = findings.length;
  const resolved = findings.filter((f) => resolvedStatuses.includes(f.status)).length;
  const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const counts: Record<string, number> = {};
  for (const f of findings) counts[f.status] = (counts[f.status] || 0) + 1;

  return (
    <div className="progress-chart-container">
      <div className="progress-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--sage)" strokeWidth="8"
            strokeDasharray={`${pct * 2.64} 264`} strokeDashoffset="0" strokeLinecap="round"
            transform="rotate(-90 50 50)" />
        </svg>
        <div className="progress-label">
          <strong>{pct}%</strong>
          <span>resolvido</span>
        </div>
      </div>
      <div className="donut-legend">
        {Object.entries(counts).map(([name, count]) => (
          <div key={name} className="legend-item">
            <StatusBadge value={name} />
            <strong style={{ marginLeft: 'auto' }}>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
