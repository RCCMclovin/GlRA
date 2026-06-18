import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import * as api from '../api';
import type { User } from '../types';

type LoginProps = {
  onLogin: (user: User) => void;
};

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name'));
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    try {
      await api.signup(name, email, password);
      const result = await api.login(email, password);
      onLogin(result.user);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('Email') || msg.includes('email') || msg.includes('já está sendo usado')) {
        setError('Este e-mail já está cadastrado.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Erro ao criar conta. Verifique os dados e tente novamente.');
      }
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

      {mode === 'login' ? (
        <form className="login-panel login-card" onSubmit={handleLogin} key="login">
          <span className="eyebrow">Acesso ao sistema</span>
          <h2>Entrar no GIRA</h2>
          <label>
            E-mail
            <input name="email" placeholder="usuario@gira.com" type="email" required />
          </label>
          <label>
            Senha
            <input name="password" placeholder="Sua senha" type="password" required />
          </label>
          {error && <small style={{ color: 'var(--red)' }}>{error}</small>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <small>
            Não tem conta?{' '}
            <button type="button" className="link-button" onClick={() => { setMode('signup'); setError(''); }}>
              Criar conta
            </button>
          </small>
        </form>
      ) : (
        <form className="login-panel login-card" onSubmit={handleSignup} key="signup">
          <span className="eyebrow">Novo usuário</span>
          <h2>Criar conta</h2>
          <label>
            Nome completo
            <input name="name" placeholder="Seu nome" minLength={3} required />
          </label>
          <label>
            E-mail
            <input name="email" placeholder="usuario@gira.com" type="email" required />
          </label>
          <label>
            Senha
            <input name="password" placeholder="Mín. 8 caracteres (A-z, 0-9, símbolo)" type="password" minLength={8} required />
          </label>
          {error && <small style={{ color: 'var(--red)' }}>{error}</small>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
          <small>
            Já tem conta?{' '}
            <button type="button" className="link-button" onClick={() => { setMode('login'); setError(''); }}>
              Entrar
            </button>
          </small>
        </form>
      )}
    </section>
  );
}
