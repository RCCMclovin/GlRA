import { Bell, FileWarning, FolderKanban, LayoutDashboard, LogOut, Plus, ShieldCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { View } from '../types';

type LayoutProps = {
  children: ReactNode;
  view: View;
  unreadNotifications: number;
  onNavigate: (view: View) => void;
  onLogout: () => void;
};

export function Layout({ children, view, unreadNotifications, onNavigate, onLogout }: LayoutProps) {
  const menu = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'projects' as View, label: 'Projetos', icon: <FolderKanban size={18} /> },
    { id: 'findings' as View, label: 'Achados', icon: <FileWarning size={18} /> },
    { id: 'users' as View, label: 'Usuários', icon: <Users size={18} /> },
    { id: 'notifications' as View, label: 'Notificações', icon: <Bell size={18} /> },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => onNavigate('dashboard')}>
          <div className="brand-mark"><ShieldCheck size={22} /></div>
          <div>
            <strong>GIRA</strong>
            <span>VulnCase acadêmico</span>
          </div>
        </div>

        <nav className="nav-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => onNavigate(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadNotifications > 0 ? <em>{unreadNotifications}</em> : null}
            </button>
          ))}
        </nav>

        <button className="new-button" onClick={() => onNavigate('new-finding')}>
          <Plus size={18} /> Novo achado
        </button>

        <button className="logout" onClick={onLogout}>
          <LogOut size={17} /> Sair
        </button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
