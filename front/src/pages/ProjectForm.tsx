import { useState } from 'react';
import type { Project, User, View } from '../types';

type ProjectFormProps = {
  users: User[];
  initialProject?: Project;
  onSaveProject: (data: { title: string; description: string }, projectId?: string) => Promise<void>;
  onNavigate: (view: View) => void;
};

export function ProjectForm({ initialProject, onSaveProject, onNavigate }: ProjectFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await onSaveProject(
        { title: String(form.get('title')), description: String(form.get('description')) },
        initialProject?.id,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar projeto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">{initialProject ? 'Edição de projeto' : 'Cadastro de projeto'}</span>
          <h1>{initialProject ? 'Editar projeto' : 'Novo projeto'}</h1>
          <p>Projeto com proprietário e descrição do escopo.</p>
        </div>
      </header>

      <form className="form-card project-form" onSubmit={handleSubmit}>
        <label>
          Título do projeto
          <input name="title" placeholder="Ex.: Portal Acadêmico" defaultValue={initialProject?.title} minLength={3} required />
        </label>
        <label>
          Descrição
          <textarea name="description" placeholder="Descreva o escopo do projeto" defaultValue={initialProject?.description} required />
        </label>

        {error && <small style={{ color: 'var(--red)' }}>{error}</small>}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => window.history.back()}>Cancelar</button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : (initialProject ? 'Salvar alterações' : 'Salvar projeto')}
          </button>
        </div>
      </form>
    </section>
  );
}
