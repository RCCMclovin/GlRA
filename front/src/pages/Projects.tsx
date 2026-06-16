import type { Project, User, View } from '../types';

type ProjectsProps = {
  projects: Project[];
  users: User[];
  onNavigate: (view: View) => void;
  onOpenProject: (projectId: string) => void;
};

export function Projects({ projects, users, onNavigate, onOpenProject }: ProjectsProps) {
  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">Projetos</span>
          <h1>Projetos cadastrados</h1>
          <p>Controle dos projetos associados aos achados de segurança.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('new-project')}>Novo projeto</button>
      </header>

      <div className="cards-grid">
        {projects.map((project) => {
          const owner = users.find((user) => user.id === project.ownerId);
          return (
            <article className="project-card" key={project.id}>
              <small>{project.id}</small>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <dl>
                <div><dt>Proprietário</dt><dd>{owner?.name}</dd></div>
                <div><dt>Criado em</dt><dd>{project.createdAt}</dd></div>
                <div><dt>Participantes</dt><dd>{project.participantIds.length}</dd></div>
              </dl>
              <button className="ghost-button full-width" onClick={() => onOpenProject(project.id)}>
                Abrir projeto
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
