import { useState } from 'react';
import type { Project, User, View } from '../types';

type ProjectFormProps = {
  users: User[];
  initialProject?: Project;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: View) => void;
};

export function ProjectForm({ users, initialProject, onSaveProject, onNavigate }: ProjectFormProps) {
  const [ownerId, setOwnerId] = useState(initialProject?.ownerId ?? 'u1');
  const [participantIds, setParticipantIds] = useState<string[]>(initialProject?.participantIds ?? ['u1']);

  function toggleParticipant(userId: string) {
    setParticipantIds((current) => current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]);
  }

  function handleOwnerChange(userId: string) {
    setOwnerId(userId);
    setParticipantIds((current) => current.includes(userId) ? current : [...current, userId]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const project: Project = {
      id: initialProject?.id ?? `PJT-${Math.floor(Math.random() * 900 + 100)}`,
      title: String(form.get('title')),
      description: String(form.get('description')),
      ownerId,
      participantIds: participantIds.length > 0 ? participantIds : [ownerId],
      createdAt: initialProject?.createdAt ?? new Date().toISOString().slice(0, 10)
    };
    onSaveProject(project);
  }

  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">{initialProject ? 'Edição de projeto' : 'Cadastro de projeto'}</span>
          <h1>{initialProject ? 'Editar projeto' : 'Novo projeto'}</h1>
          <p>Projeto com proprietário, participantes e descrição do escopo.</p>
        </div>
      </header>

      <form className="form-card project-form" onSubmit={handleSubmit}>
        <label>
          Título do projeto
          <input name="title" placeholder="Ex.: Portal Acadêmico" defaultValue={initialProject?.title} required />
        </label>
        <label>
          Descrição
          <textarea name="description" placeholder="Descreva o escopo do projeto" defaultValue={initialProject?.description} required />
        </label>
        <label>
          Proprietário
          <select name="ownerId" value={ownerId} onChange={(event) => handleOwnerChange(event.target.value)}>
            {users.map((user) => <option value={user.id} key={user.id}>{user.name}</option>)}
          </select>
        </label>

        <fieldset className="participants-box">
          <legend>Participantes do projeto</legend>
          <p>Selecione os usuários que poderão acompanhar modificações e achados do projeto.</p>
          <div className="participants-grid">
            {users.map((user) => (
              <label className="check-row" key={user.id}>
                <input type="checkbox" checked={participantIds.includes(user.id)} onChange={() => toggleParticipant(user.id)} disabled={user.id === ownerId} />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => onNavigate(initialProject ? 'project-details' : 'projects')}>Cancelar</button>
          <button className="primary-button" type="submit">{initialProject ? 'Salvar alterações' : 'Salvar projeto'}</button>
        </div>
      </form>
    </section>
  );
}
