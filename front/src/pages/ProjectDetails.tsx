import { useCallback, useEffect, useState } from 'react';
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
  const [addUserId, setAddUserId] = useState('');
  const [loadingAccess, setLoadingAccess] = useState(false);

  const loadParticipants = useCallback(async () => {
    if (!project) return;
    try {
      setParticipants(await api.getProjectUsers(project.id));
    } catch { /* ignore */ }
  }, [project]);

  useEffect(() => { loadParticipants(); }, [loadParticipants]);

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

  const participantIds = new Set(participants.map((p) => p.id));
  const availableUsers = users.filter((u) => !participantIds.has(u.id));

  async function handleAddParticipant() {
    if (!addUserId || !project) return;
    setLoadingAccess(true);
    try {
      await api.grantAccess(project.id, addUserId);
      await loadParticipants();
      setAddUserId('');
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

      {/* Participants management */}
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
                <button
                  className="link-button"
                  style={{ color: 'var(--red)' }}
                  onClick={() => handleRemoveParticipant(user.id)}
                  disabled={loadingAccess}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>

        {availableUsers.length > 0 && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <label style={{ flex: 1 }}>
              Adicionar participante
              <select value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
                <option value="">Selecione um usuário...</option>
                {availableUsers.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </label>
            <button className="primary-button" onClick={handleAddParticipant} disabled={!addUserId || loadingAccess}>
              Adicionar
            </button>
          </div>
        )}
      </article>

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
                <tr>
                  <th>ID</th><th>Título</th><th>CWE</th><th>Severidade</th><th>Status</th><th>Responsável</th><th>Ação</th>
                </tr>
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
