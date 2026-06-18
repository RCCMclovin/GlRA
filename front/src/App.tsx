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
import * as api from './api';
import type { Finding, Lookup, Notification, Project, User, View } from './types';

function App() {
  const [view, setViewRaw] = useState<View>('login');
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

  function navigate(v: View) {
    setViewRaw(v);
    window.history.pushState({ view: v }, '', `#${v}`);
  }

  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      const v = e.state?.view as View | undefined;
      if (v) setViewRaw(v);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    api.getMe()
      .then(async (user) => {
        setCurrentUser(user);
        setViewRaw('dashboard');
        window.history.replaceState({ view: 'dashboard' }, '', '#dashboard');
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
    navigate('dashboard');
  }

  async function handleLogout() {
    try { await api.apiLogout(); } catch { /* ignore */ }
    setCurrentUser(null);
    setProjects([]);
    setFindings([]);
    setNotifications([]);
    setUsers([]);
    navigate('login');
  }

  function handleOpenDetails(id: string) {
    setSelectedFindingId(id);
    navigate('finding-details');
  }

  function handleOpenProject(projectId: string) {
    setSelectedProjectId(projectId);
    navigate('project-details');
  }

  async function handleSaveProject(data: { title: string; description: string }, projectId?: string) {
    if (projectId) {
      await api.updateProject(projectId, data);
    } else {
      await api.createProject(data);
    }
    await loadAllData();
    navigate('projects');
  }

  async function handleSaveFinding(payload: api.CreateFindingPayload | api.UpdateFindingPayload, findingId?: string) {
    if (findingId) {
      await api.updateFinding(findingId, payload as api.UpdateFindingPayload);
    } else {
      await api.createFinding(payload as api.CreateFindingPayload);
    }
    await loadAllData();
    navigate('findings');
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

  async function handleToggleNotification(id: number) {
    await api.toggleNotificationRead(id);
    setNotifications(await api.getNotifications());
  }

  async function handleDeleteNotification(id: number) {
    await api.deleteNotification(id);
    setNotifications(await api.getNotifications());
  }

  function goBack() {
    window.history.back();
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
      <Layout view={view} unreadNotifications={0} onNavigate={navigate} onLogout={handleLogout}>
        <section className="empty-state"><h1>Carregando...</h1></section>
      </Layout>
    );
  }

  const selectedFinding = findings.find((f) => f.id === selectedFindingId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Layout view={view} unreadNotifications={unreadNotifications} onNavigate={navigate} onLogout={handleLogout}>
      {view === 'dashboard' && (
        <Dashboard
          currentUserId={currentUser?.id ?? ''}
          findings={findings}
          projects={projects}
          users={users}
          onNavigate={navigate}
          onOpenProject={handleOpenProject}
          onOpenFinding={handleOpenDetails}
        />
      )}
      {view === 'projects' && (
        <Projects projects={projects} users={users} onNavigate={navigate} onOpenProject={handleOpenProject} />
      )}
      {view === 'project-details' && (
        <ProjectDetails
          project={selectedProject}
          findings={findings}
          users={users}
          onNavigate={navigate}
          onOpenFinding={handleOpenDetails}
        />
      )}
      {view === 'new-project' && (
        <ProjectForm users={users} onSaveProject={handleSaveProject} onNavigate={navigate} />
      )}
      {view === 'edit-project' && (
        <ProjectForm users={users} initialProject={selectedProject} onSaveProject={handleSaveProject} onNavigate={navigate} />
      )}
      {view === 'findings' && (
        <Findings findings={findings} projects={projects} users={users} severities={severities} statuses={statuses} onNavigate={navigate} onOpenDetails={handleOpenDetails} />
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
          onNavigate={navigate}
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
          onNavigate={navigate}
        />
      )}
      {view === 'finding-details' && (
        <FindingDetails
          finding={selectedFinding}
          projects={projects}
          users={users}
          statuses={statuses}
          onUpdateStatus={handleUpdateStatus}
          onNavigate={navigate}
        />
      )}
      {view === 'notifications' && (
        <Notifications notifications={notifications} projects={projects} onToggleRead={handleToggleNotification} onDelete={handleDeleteNotification} />
      )}
    </Layout>
  );
}

export default App;
