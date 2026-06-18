import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import * as api from '../api';
import type { User } from '../types';

type LoginProps = {
  onLogin: (user: User) => void;
};

export function Login({ onLogin }: LoginProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await api.login(String(form.get('email')), String(form.get('password')));
      onLogin(result.user);
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-panel intro-panel">
        <div className="brand-lockup">
          <div className="brand-mark large"><ShieldCheck size={34} /></div>
          <div>
            <h1>GIRA</h1>
            <p>Gestão de achados, riscos e correções.</p>
          </div>
        </div>
        <p className="intro-text">
          Ferramenta para registrar projetos, achados de segurança, evidências,
          severidade, status e responsáveis pela remediação.
        </p>
      </div>

      <form className="login-panel login-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Acesso ao sistema</span>
        <h2>Entrar no GIRA</h2>
        <label>
          E-mail
          <input name="email" placeholder="user@glra.com" type="email" required />
        </label>
        <label>
          Senha
          <input name="password" placeholder="Senha" type="password" required />
        </label>
        {error && <small style={{ color: 'var(--red)' }}>{error}</small>}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
