import type { User } from '../types';

type UsersPageProps = {
  users: User[];
  onCreateUser: (user: User) => void;
};

export function UsersPage({ users, onCreateUser }: UsersPageProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name'));
    const email = String(form.get('email'));
    onCreateUser({ id: `u${Math.floor(Math.random() * 900 + 100)}`, name, email });
    event.currentTarget.reset();
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">Usuários</span>
          <h1>Usuários do sistema</h1>
          <p>Base visual para cadastro de usuários, participantes e responsáveis.</p>
        </div>
      </header>

      <div className="users-layout">
        <article className="card">
          <h2>Usuários cadastrados</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Nome</th><th>E-mail</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <form className="form-card user-form" onSubmit={handleSubmit}>
          <h2>Cadastrar usuário</h2>
          <label>
            Nome
            <input name="name" placeholder="Nome completo" required />
          </label>
          <label>
            E-mail
            <input name="email" type="email" placeholder="usuario@gira.local" required />
          </label>
          <button className="primary-button" type="submit">Salvar usuário</button>
        </form>
      </div>
    </section>
  );
}
