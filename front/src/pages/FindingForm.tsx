import type { Finding, FindingStatus, Project, Severity, User, View } from '../types';

type FindingFormProps = {
  projects: Project[];
  users: User[];
  initialFinding?: Finding;
  onSaveFinding: (finding: Finding) => void;
  onNavigate: (view: View) => void;
};

const severities: Severity[] = ['Crítica', 'Alta', 'Média', 'Baixa', 'Informativa'];
const statuses: FindingStatus[] = ['Aberto', 'Em análise', 'Em correção', 'Corrigido', 'Aceito como risco', 'Falso positivo'];

export function FindingForm({ projects, users, initialFinding, onSaveFinding, onNavigate }: FindingFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSaveFinding({
      id: initialFinding?.id ?? `ACH-${Math.floor(Math.random() * 900 + 100)}`,
      projectId: String(form.get('projectId')),
      title: String(form.get('title')),
      description: String(form.get('description')),
      createdAt: initialFinding?.createdAt ?? new Date().toISOString().slice(0, 10),
      reporterId: initialFinding?.reporterId ?? 'u1',
      severity: String(form.get('severity')) as Severity,
      status: String(form.get('status')) as FindingStatus,
      remediation: String(form.get('remediation')),
      evidenceUrl: String(form.get('evidenceUrl')),
      assigneeId: String(form.get('assigneeId')),
      category: String(form.get('category'))
    });
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
          <select name="projectId" defaultValue={initialFinding?.projectId}>{projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}</select>
        </label>
        <label>
          Categoria CWE
          <input name="category" placeholder="Ex.: CWE-89" defaultValue={initialFinding?.category} required />
        </label>
        <label>
          Severidade
          <select name="severity" defaultValue={initialFinding?.severity}>{severities.map((severity) => <option key={severity}>{severity}</option>)}</select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={initialFinding?.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        </label>
        <label>
          Responsável
          <select name="assigneeId" defaultValue={initialFinding?.assigneeId}>{users.map((user) => <option value={user.id} key={user.id}>{user.name}</option>)}</select>
        </label>
        <label className="full-row">
          Descrição técnica
          <textarea name="description" placeholder="Descreva o problema identificado" defaultValue={initialFinding?.description} required />
        </label>
        <label className="full-row">
          Proposta de remediação
          <textarea name="remediation" placeholder="Indique como o achado deverá ser corrigido" defaultValue={initialFinding?.remediation} required />
        </label>
        <label className="full-row">
          Evidência
          <input name="evidenceUrl" placeholder="Ex.: evidencias/achado.png" defaultValue={initialFinding?.evidenceUrl} required />
        </label>
        <div className="form-actions full-row">
          <button className="ghost-button" type="button" onClick={() => onNavigate(initialFinding ? 'finding-details' : 'findings')}>Cancelar</button>
          <button className="primary-button" type="submit">{initialFinding ? 'Salvar alterações' : 'Salvar achado'}</button>
        </div>
      </form>
    </section>
  );
}
