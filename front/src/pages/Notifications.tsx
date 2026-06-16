import type { Notification, Project } from '../types';

type NotificationsProps = {
  notifications: Notification[];
  projects: Project[];
};

export function Notifications({ notifications, projects }: NotificationsProps) {
  return (
    <section>
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Notificações</span>
          <h1>Atualizações dos projetos</h1>
          <p>Eventos simulados para projetos em que o usuário participa.</p>
        </div>
      </header>

      <div className="notification-list">
        {notifications.map((notification) => {
          const project = projects.find((item) => item.id === notification.projectId);
          return (
            <article className={notification.read ? 'notification-card' : 'notification-card unread'} key={notification.id}>
              <small>{notification.createdAt} · {project?.title}</small>
              <p>{notification.message}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
