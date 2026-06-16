import { ShieldCheck } from 'lucide-react';

type LoginProps = {
  onLogin: () => void;
};

export function Login({ onLogin }: LoginProps) {
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
          Protótipo de frontend para registrar projetos, achados de segurança, evidências,
          severidade, status e responsáveis pela remediação.
        </p>
      </div>

      <form className="login-panel login-card" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
        <span className="eyebrow">Acesso ao sistema</span>
        <h2>Entrar no GIRA</h2>
        <label>
          E-mail
          <input defaultValue="larissa@gira.local" type="email" />
        </label>
        <label>
          Senha
          <input defaultValue="123456" type="password" />
        </label>
        <button className="primary-button" type="submit">Entrar</button>
        <small>Frontend demonstrativo. Sem conexão com backend nesta etapa.</small>
      </form>
    </section>
  );
}
