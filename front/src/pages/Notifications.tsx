import { Trash2 } from 'lucide-react';
import type { Notification, Project } from '../types';

type NotificationsProps = {
  notifications: Notification[];
  projects: Project[];
  onToggleRead: (id: number) => void;
  onDelete: (id: number) => void;
};

export function Notifications({ notifications, onToggleRead, onDelete }: NotificationsProps) {
  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Notificações</span>
          <h1>Atualizações dos projetos</h1>
          <p>Eventos relacionados aos projetos em que o usuário participa.</p>
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="empty-inline">Nenhuma notificação.</div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <article
              className={notification.read ? 'notification-card' : 'notification-card unread'}
              key={notification.id}
            >
              <div className="notification-row">
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onToggleRead(notification.id)}>
                  <p style={{ margin: 0 }}>{notification.content}</p>
                  <small>{notification.read ? 'Lida' : 'Clique para marcar como lida'}</small>
                </div>
                <button
                  className="notification-delete"
                  title="Apagar notificação"
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
