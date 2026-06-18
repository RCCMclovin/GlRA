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
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(false);

  const loadParticipants = useCallback(async () => {
    if (!project) return;
    try { setParticipants(await api.getProjectUsers(project.id)); } catch { /* */ }
  }, [project]);

  useEffect(() => { loadParticipants(); }, [loadParticipants]);

  const participantIds = useMemo(() => new Set(participants.map((p) => p.id)), [participants]);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    if (searchText.length < 1) { setSearchResults([]); return; }
    const timeout = setTimeout(() => {
      api.searchUsers(searchText)
        .then((results) => setSearchResults(results.filter((u) => !participantIds.has(u.id))))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText, participantIds]);

  if (!project) {
    return (
      <section className="empty-state">
        <h1>Projeto não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('projects')}>Voltar para projetos</button>
      </section>
    );
  }

  const owner = users.find((u) => u.id === project.creatorId);
  const pf = findings.filter((f) => f.projectId === project.id);
  const critical = pf.filter((f) => f.severity === 'Crítica').length;
  const open = pf.filter((f) => f.status === 'Aberto').length;
  const fixed = pf.filter((f) => f.status === 'Corrigido').length;

  async function handleAdd(userId: string) {
    if (!project) return;
    setLoadingAccess(true);
    try {
      await api.grantAccess(project.id, userId);
      await loadParticipants();
      setSearchText('');
      setShowDropdown(false);
    } catch { /* */ }
    setLoadingAccess(false);
  }

  async function handleRemove(userId: string) {
    if (!project || userId === project.creatorId) return;
    setLoadingAccess(true);
    try {
      await api.revokeAccess(project.id, userId);
      await loadParticipants();
    } catch { /* */ }
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
          <StatCard label="Achados" value={pf.length} hint="Total do projeto" />
          <StatCard label="Críticos" value={critical} hint="Prioridade máxima" />
          <StatCard label="Abertos" value={open} hint="Pendentes" />
          <StatCard label="Corrigidos" value={fixed} hint="Remediados" />
        </div>
      </div>

      {/* Participantes */}
      <article className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div>
            <h2>Participantes do projeto</h2>
            <p className="muted-text">Usuários com acesso a este projeto.</p>
          </div>
        </div>

        <div className="participants-grid" style={{ marginBottom: 16 }}>
          {participants.map((u) => (
            <div className="check-row" key={u.id}>
              <span style={{ flex: 1 }}>
                <strong>{u.name}</strong>
                <br /><small style={{ color: 'var(--muted)' }}>{u.email}</small>
              </span>
              {u.id === project.creatorId ? (
                <span className="badge info">Dono</span>
              ) : (
                <button className="link-button" style={{ color: 'var(--red)' }} onClick={() => handleRemove(u.id)} disabled={loadingAccess}>Remover</button>
              )}
            </div>
          ))}
        </div>

        {/* Adicionar participante — dropdown com busca */}
        <div className="add-participant-box">
          <label>Adicionar participante</label>
          <div className="ac-wrapper">
            <input
              placeholder="Digite para buscar por nome ou e-mail..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              disabled={loadingAccess}
            />
            {showDropdown && searchText.length >= 1 && (
              <div className="ac-dropdown">
                {searchResults.length === 0 ? (
                  <div className="ac-empty">Nenhum usuário encontrado para "{searchText}".</div>
                ) : (
                  searchResults.map((u) => (
                    <button key={u.id} className="ac-option" onClick={() => handleAdd(u.id)} disabled={loadingAccess}>
                      <div>
                        <strong>{u.name}</strong>
                        <span>{u.email}</span>
                      </div>
                      <span className="ac-add-label">+ Adicionar</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Gráficos */}
      {pf.length > 0 && (
        <article className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div>
              <h2>Visão geral de achados</h2>
              <p className="muted-text">Distribuição de severidade e status deste projeto.</p>
            </div>
          </div>
          <div className="chart-grid">
            <SeverityDonut findings={pf} />
            <StatusRing findings={pf} />
          </div>
        </article>
      )}

      {/* Tabela de achados */}
      <article className="card project-findings-card">
        <div className="card-header">
          <div>
            <h2>Achados do projeto</h2>
            <p className="muted-text">Lista de vulnerabilidades vinculadas a este projeto.</p>
          </div>
          <button className="ghost-button" onClick={() => onNavigate('new-finding')}>Cadastrar achado</button>
        </div>
        {pf.length === 0 ? (
          <div className="empty-inline">Nenhum achado registrado para este projeto.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Título</th><th>CWE</th><th>Severidade</th><th>Status</th><th>Responsável</th><th>Ação</th></tr></thead>
              <tbody>
                {pf.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id.slice(0, 8)}</td>
                    <td>{f.title}</td>
                    <td>{f.category}</td>
                    <td><SeverityBadge value={f.severity} /></td>
                    <td><StatusBadge value={f.status} /></td>
                    <td>{f.assigned.name}</td>
                    <td><button className="link-button" onClick={() => onOpenFinding(f.id)}>Detalhes</button></td>
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

/* ---------- chart components ---------- */

const sevColors: Record<string, string> = {
  'Crítica': '#d96f68', 'Alta': '#eaa383', 'Média': '#d6b75d',
  'Baixa': '#8fbea0', 'Informativa': '#7c8ed8',
};
const resolvedStatuses = ['Corrigido', 'Aceito como risco', 'Falso positivo'];

function SeverityDonut({ findings }: { findings: Finding[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
    let cum = 0;
    const segs = Object.entries(counts).map(([name, count]) => {
      const pct = (count / findings.length) * 100;
      const start = cum; cum += pct;
      return { name, count, pct, start, color: sevColors[name] || '#ccc' };
    });
    return segs;
  }, [findings]);

  const gradient = data.map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(', ');

  return (
    <div className="donut-chart-container">
      <div className="donut-chart" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="donut-hole"><strong>{findings.length}</strong><span>achados</span></div>
      </div>
      <div className="donut-legend">
        {data.map((s) => (
          <div key={s.name} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span>{s.name}</span><strong>{s.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusRing({ findings }: { findings: Finding[] }) {
  const resolved = findings.filter((f) => resolvedStatuses.includes(f.status)).length;
  const pct = findings.length > 0 ? Math.round((resolved / findings.length) * 100) : 0;
  const counts: Record<string, number> = {};
  for (const f of findings) counts[f.status] = (counts[f.status] || 0) + 1;

  return (
    <div className="progress-chart-container">
      <div className="progress-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e4ded6" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#8fbea0" strokeWidth="8"
            strokeDasharray={`${pct * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
        </svg>
        <div className="progress-label"><strong>{pct}%</strong><span>resolvido</span></div>
      </div>
      <div className="donut-legend">
        {Object.entries(counts).map(([name, count]) => (
          <div key={name} className="legend-item">
            <StatusBadge value={name} /><strong style={{ marginLeft: 'auto' }}>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
