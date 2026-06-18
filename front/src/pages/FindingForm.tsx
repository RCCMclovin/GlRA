import { useState } from 'react';
import type { CreateFindingPayload, UpdateFindingPayload } from '../api';
import type { Finding, Lookup, Project, User, View } from '../types';

type FindingFormProps = {
  projects: Project[];
  users: User[];
  severities: Lookup[];
  statuses: Lookup[];
  categories: Lookup[];
  initialFinding?: Finding;
  onSaveFinding: (payload: CreateFindingPayload | UpdateFindingPayload, findingId?: string) => Promise<void>;
  onNavigate: (view: View) => void;
};

export function FindingForm({ projects, users, severities, statuses, categories, initialFinding, onSaveFinding, onNavigate }: FindingFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialSeverityId = initialFinding ? severities.find((s) => s.name === initialFinding.severity)?.id : severities[0]?.id;
  const initialStatusId = initialFinding ? statuses.find((s) => s.name === initialFinding.status)?.id : statuses[0]?.id;
  const initialCategoryId = initialFinding ? categories.find((c) => c.name === initialFinding.category)?.id : categories[0]?.id;
  const initialAssignedId = initialFinding ? initialFinding.assigned.id : users[0]?.id;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      if (initialFinding) {
        const payload: UpdateFindingPayload = {
          title: String(form.get('title')),
          description: String(form.get('description')),
          solution: String(form.get('solution')),
          assignedId: String(form.get('assignedId')),
          severityId: String(form.get('severityId')),
          statusId: String(form.get('statusId')),
          categoryId: String(form.get('categoryId')),
        };
        await onSaveFinding(payload, initialFinding.id);
      } else {
        const payload: CreateFindingPayload = {
          title: String(form.get('title')),
          description: String(form.get('description')),
          solution: String(form.get('solution')),
          assignedId: String(form.get('assignedId')),
          severityId: String(form.get('severityId')),
          statusId: String(form.get('statusId')),
          categoryId: String(form.get('categoryId')),
          projectId: String(form.get('projectId')),
        };
        await onSaveFinding(payload);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar achado.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">{initialFinding ? 'Edição de achado' : 'Cadastro de achado'}</span>
          <h1>{initialFinding ? 'Editar achado' : 'Cadastrar achado'}</h1>
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
          {initialFinding ? (
            <input value={projects.find((p) => p.id === initialFinding.projectId)?.title ?? ''} disabled />
          ) : (
            <select name="projectId" defaultValue={projects[0]?.id}>
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
          <select name="assignedId" defaultValue={initialAssignedId}>
            {users.map((u) => <option value={u.id} key={u.id}>{u.name}</option>)}
          </select>
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
          <button className="ghost-button" type="button" onClick={() => onNavigate(initialFinding ? 'finding-details' : 'findings')}>Cancelar</button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : (initialFinding ? 'Salvar alterações' : 'Salvar achado')}
          </button>
        </div>
      </form>
    </section>
  );
}
