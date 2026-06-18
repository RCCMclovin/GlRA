import { useEffect, useState } from 'react';
import * as api from '../api';
import type { CreateFindingPayload, UpdateFindingPayload } from '../api';
import type { Finding, Lookup, Project, User, View } from '../types';

type FindingFormProps = {
  projects: Project[];
  users: User[];
  severities: Lookup[];
  statuses: Lookup[];
  categories: Lookup[];
  initialFinding?: Finding;
  preselectedProjectId?: string;
  onSaveFinding: (payload: CreateFindingPayload | UpdateFindingPayload, findingId?: string) => Promise<void>;
  onNavigate: (view: View) => void;
};

export function FindingForm({ projects, severities, statuses, categories, initialFinding, preselectedProjectId, onSaveFinding, onNavigate }: FindingFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [projectParticipants, setProjectParticipants] = useState<User[]>([]);

  const fixedProjectId = initialFinding?.projectId ?? preselectedProjectId ?? projects[0]?.id ?? '';
  const [selectedProjectId, setSelectedProjectId] = useState(fixedProjectId);
  const isEditing = !!initialFinding;

  const initialSeverityId = initialFinding ? severities.find((s) => s.name === initialFinding.severity)?.id : severities[0]?.id;
  const initialStatusId = initialFinding ? statuses.find((s) => s.name === initialFinding.status)?.id : statuses[0]?.id;
  const initialCategoryId = initialFinding ? categories.find((c) => c.name === initialFinding.category)?.id : categories[0]?.id;
  const initialAssignedId = initialFinding ? initialFinding.assigned.id : '';

  useEffect(() => {
    if (!selectedProjectId) return;
    api.getProjectUsers(selectedProjectId)
      .then(setProjectParticipants)
      .catch(() => setProjectParticipants([]));
  }, [selectedProjectId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      if (isEditing) {
        const payload: UpdateFindingPayload = {
          title: String(form.get('title')),
          description: String(form.get('description')),
          solution: String(form.get('solution')),
          assignedId: String(form.get('assignedId')),
          severityId: String(form.get('severityId')),
          statusId: String(form.get('statusId')),
          categoryId: String(form.get('categoryId')),
        };
        await onSaveFinding(payload, initialFinding!.id);
      } else {
        const payload: CreateFindingPayload = {
          title: String(form.get('title')),
          description: String(form.get('description')),
          solution: String(form.get('solution')),
          assignedId: String(form.get('assignedId')),
          severityId: String(form.get('severityId')),
          statusId: String(form.get('statusId')),
          categoryId: String(form.get('categoryId')),
          projectId: selectedProjectId,
        };
        await onSaveFinding(payload);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar achado.');
    } finally {
      setSaving(false);
    }
  }

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">{isEditing ? 'Edição de achado' : 'Cadastro de achado'}</span>
          <h1>{isEditing ? 'Editar achado' : 'Cadastrar achado'}</h1>
          <p>Registro estruturado de vulnerabilidade vinculada a um projeto.</p>
        </div>
      </header>

      <form className="form-card two-columns" onSubmit={handleSubmit}>
        <label>
          Título
          <input name="title" placeholder="Ex.: SQL Injection em busca" defaultValue={initialFinding?.title} required />
        </label>
        <label>
          Projeto
          {isEditing || preselectedProjectId ? (
            <input value={currentProject?.title ?? ''} disabled />
          ) : (
            <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              {projects.map((p) => <option value={p.id} key={p.id}>{p.title}</option>)}
            </select>
          )}
        </label>
        <label>
          Categoria CWE
          <select name="categoryId" defaultValue={initialCategoryId}>
            {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          Severidade
          <select name="severityId" defaultValue={initialSeverityId}>
            {severities.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>
          Status
          <select name="statusId" defaultValue={initialStatusId}>
            {statuses.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>
          Responsável
          {projectParticipants.length === 0 ? (
            <select disabled><option>Carregando participantes...</option></select>
          ) : (
            <select name="assignedId" defaultValue={initialAssignedId || projectParticipants[0]?.id}>
              {projectParticipants.map((u) => <option value={u.id} key={u.id}>{u.name}</option>)}
            </select>
          )}
        </label>
        <label className="full-row">
          Descrição técnica
          <textarea name="description" placeholder="Descreva o problema identificado" defaultValue={initialFinding?.description} required />
        </label>
        <label className="full-row">
          Proposta de remediação
          <textarea name="solution" placeholder="Indique como o achado deverá ser corrigido" defaultValue={initialFinding?.solution} required />
        </label>

        {error && <small className="full-row" style={{ color: 'var(--red)' }}>{error}</small>}

        <div className="form-actions full-row">
          <button className="ghost-button" type="button" onClick={() => onNavigate(isEditing ? 'finding-details' : 'findings')}>Cancelar</button>
          <button className="primary-button" type="submit" disabled={saving || projectParticipants.length === 0}>
            {saving ? 'Salvando...' : (isEditing ? 'Salvar alterações' : 'Salvar achado')}
          </button>
        </div>
      </form>
    </section>
  );
}
