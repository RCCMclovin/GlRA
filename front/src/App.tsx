import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FindingDetails } from './pages/FindingDetails';
import { FindingForm } from './pages/FindingForm';
import { Findings } from './pages/Findings';
import { Login } from './pages/Login';
import { Notifications } from './pages/Notifications';
import { ProjectDetails } from './pages/ProjectDetails';
import { ProjectForm } from './pages/ProjectForm';
import { Projects } from './pages/Projects';
import { UsersPage } from './pages/UsersPage';
import * as api from './api';
import type { Finding, Lookup, Notification, Project, User, View } from './types';

function App() {
  const [view, setView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [severities, setSeverities] = useState<Lookup[]>([]);
  const [statuses, setStatuses] = useState<Lookup[]>([]);
  const [categories, setCategories] = useState<Lookup[]>([]);

  const [selectedFindingId, setSelectedFindingId] = useState<string | undefined>();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(async (user) => {
        setCurrentUser(user);
        setView('dashboard');
        await loadAllData();
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => setCheckingSession(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadNotifications = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsData, notificationsData, severitiesData, statusesData, categoriesData, usersData] = await Promise.all([
        api.getMyProjects(),
        api.getNotifications(),
        api.getSeverities(),
        api.getStatuses(),
        api.getCategories(),
        api.getUsers().catch(() => [] as User[]),
      ]);
      setProjects(projectsData);
      setNotifications(notificationsData);
      setSeverities(severitiesData);
      setStatuses(statusesData);
      setCategories(categoriesData);
      setUsers(usersData);

      const allFindings = (await Promise.all(
        projectsData.map((p) => api.getProjectFindings(p.id).catch(() => []))
      )).flat();
      setFindings(allFindings);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLogin(user: User) {
    setCurrentUser(user);
    await loadAllData();
    setView('dashboard');
  }

  async function handleLogout() {
    try { await api.apiLogout(); } catch { /* ignore */ }
    setCurrentUser(null);
    setProjects([]);
    setFindings([]);
    setNotifications([]);
    setUsers([]);
    setView('login');
  }

  function handleOpenDetails(id: string) {
    setSelectedFindingId(id);
    setView('finding-details');
  }

  function handleOpenProject(projectId: string) {
    setSelectedProjectId(projectId);
    setView('project-details');
  }

  async function handleSaveProject(data: { title: string; description: string }, projectId?: string) {
    if (projectId) {
      await api.updateProject(projectId, data);
    } else {
      await api.createProject(data);
    }
    await loadAllData();
    setView('projects');
  }

  async function handleSaveFinding(payload: api.CreateFindingPayload | api.UpdateFindingPayload, findingId?: string) {
    if (findingId) {
      await api.updateFinding(findingId, payload as api.UpdateFindingPayload);
    } else {
      await api.createFinding(payload as api.CreateFindingPayload);
    }
    await loadAllData();
    setView('findings');
  }

  async function handleUpdateStatus(findingId: string, statusId: string) {
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) return;
    const severityLookup = severities.find((s) => s.name === finding.severity);
    const categoryLookup = categories.find((c) => c.name === finding.category);
    await api.updateFinding(findingId, {
      title: finding.title,
      solution: finding.solution,
      description: finding.description,
      assignedId: finding.assigned.id,
      statusId,
      severityId: severityLookup?.id ?? '',
      categoryId: categoryLookup?.id ?? '',
    });
    await loadAllData();
  }

  async function handleCreateUser(data: { name: string; email: string; password: string }) {
    await api.createUser(data);
    try { setUsers(await api.getUsers()); } catch { /* ignore */ }
  }

  async function handleToggleNotification(id: number) {
    await api.toggleNotificationRead(id);
    setNotifications(await api.getNotifications());
  }

  async function handleDeleteNotification(id: number) {
    await api.deleteNotification(id);
    setNotifications(await api.getNotifications());
  }

  if (checkingSession || (loading && view === 'login')) {
    return (
      <section className="empty-state"><h1>Carregando...</h1></section>
    );
  }

  if (view === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <Layout view={view} unreadNotifications={0} onNavigate={setView} onLogout={handleLogout}>
        <section className="empty-state"><h1>Carregando...</h1></section>
      </Layout>
    );
  }

  const selectedFinding = findings.find((f) => f.id === selectedFindingId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Layout view={view} unreadNotifications={unreadNotifications} onNavigate={setView} onLogout={handleLogout}>
      {view === 'dashboard' && (
        <Dashboard
          currentUserId={currentUser?.id ?? ''}
          findings={findings}
          projects={projects}
          users={users}
          onNavigate={setView}
          onOpenProject={handleOpenProject}
          onOpenFinding={handleOpenDetails}
        />
      )}
      {view === 'projects' && (
        <Projects projects={projects} users={users} onNavigate={setView} onOpenProject={handleOpenProject} />
      )}
      {view === 'project-details' && (
        <ProjectDetails
          project={selectedProject}
          findings={findings}
          users={users}
          onNavigate={setView}
          onOpenFinding={handleOpenDetails}
        />
      )}
      {view === 'new-project' && (
        <ProjectForm users={users} onSaveProject={handleSaveProject} onNavigate={setView} />
      )}
      {view === 'edit-project' && (
        <ProjectForm users={users} initialProject={selectedProject} onSaveProject={handleSaveProject} onNavigate={setView} />
      )}
      {view === 'findings' && (
        <Findings findings={findings} projects={projects} users={users} severities={severities} statuses={statuses} onNavigate={setView} onOpenDetails={handleOpenDetails} />
      )}
      {view === 'new-finding' && (
        <FindingForm
          projects={projects}
          users={users}
          severities={severities}
          statuses={statuses}
          categories={categories}
          preselectedProjectId={selectedProjectId}
          onSaveFinding={handleSaveFinding}
          onNavigate={setView}
        />
      )}
      {view === 'edit-finding' && (
        <FindingForm
          projects={projects}
          users={users}
          severities={severities}
          statuses={statuses}
          categories={categories}
          initialFinding={selectedFinding}
          onSaveFinding={handleSaveFinding}
          onNavigate={setView}
        />
      )}
      {view === 'finding-details' && (
        <FindingDetails
          finding={selectedFinding}
          projects={projects}
          users={users}
          statuses={statuses}
          onUpdateStatus={handleUpdateStatus}
          onNavigate={setView}
        />
      )}
      {view === 'users' && <UsersPage users={users} onCreateUser={handleCreateUser} />}
      {view === 'notifications' && (
        <Notifications notifications={notifications} projects={projects} onToggleRead={handleToggleNotification} onDelete={handleDeleteNotification} />
      )}
    </Layout>
  );
}

export default App;
