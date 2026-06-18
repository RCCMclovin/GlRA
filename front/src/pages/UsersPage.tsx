import { useState } from 'react';
import type { User } from '../types';

type UsersPageProps = {
  users: User[];
  onCreateUser: (data: { name: string; email: string; password: string }) => Promise<void>;
};

export function UsersPage({ users, onCreateUser }: UsersPageProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await onCreateUser({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
      });
      event.currentTarget.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar usuário.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">Usuários</span>
          <h1>Usuários do sistema</h1>
          <p>Cadastro de usuários, participantes e responsáveis.</p>
        </div>
      </header>

      <div className="users-layout">
        <article className="card">
          <h2>Usuários cadastrados</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>E-mail</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}><td>{user.name}</td><td>{user.email}</td></tr>
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
          <label>
            Senha
            <input name="password" type="password" placeholder="Mínimo 3 caracteres" minLength={3} required />
          </label>
          {error && <small style={{ color: 'var(--red)' }}>{error}</small>}
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar usuário'}
          </button>
        </form>
      </div>
    </section>
  );
}
