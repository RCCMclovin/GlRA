import { useMemo, useState } from 'react';
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
import { findings as initialFindings, notifications as initialNotifications, projects as initialProjects, users as initialUsers } from './data/mockData';
import type { Finding, FindingStatus, Project, User, View } from './types';

function App() {
  const [view, setView] = useState<View>('login');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [selectedFindingId, setSelectedFindingId] = useState<string | undefined>();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [notifications] = useState(initialNotifications);

  const unreadNotifications = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  function handleOpenDetails(id: string) {
    setSelectedFindingId(id);
    setView('finding-details');
  }

  function handleOpenProject(projectId: string) {
    setSelectedProjectId(projectId);
    setView('project-details');
  }

  function handleSaveProject(project: Project) {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      return exists ? current.map((item) => item.id === project.id ? project : item) : [project, ...current];
    });
    setSelectedProjectId(project.id);
    setView('project-details');
  }

  function handleSaveFinding(finding: Finding) {
    setFindings((current) => {
      const exists = current.some((item) => item.id === finding.id);
      return exists ? current.map((item) => item.id === finding.id ? finding : item) : [finding, ...current];
    });
    setSelectedFindingId(finding.id);
    setSelectedProjectId(finding.projectId);
    setView('finding-details');
  }

  function handleCreateUser(user: User) {
    setUsers((current) => [user, ...current]);
  }

  function handleUpdateStatus(id: string, status: FindingStatus) {
    setFindings((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  if (view === 'login') {
    return <Login onLogin={() => setView('dashboard')} />;
  }

  const selectedFinding = findings.find((finding) => finding.id === selectedFindingId);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <Layout view={view} unreadNotifications={unreadNotifications} onNavigate={setView} onLogout={() => setView('login')}>
      {view === 'dashboard' && <Dashboard currentUserId="u1" findings={findings} projects={projects} users={users} notifications={notifications} onNavigate={setView} onOpenProject={handleOpenProject} onOpenFinding={handleOpenDetails} />}
      {view === 'projects' && <Projects projects={projects} users={users} onNavigate={setView} onOpenProject={handleOpenProject} />}
      {view === 'project-details' && <ProjectDetails project={selectedProject} findings={findings} users={users} onNavigate={setView} onOpenFinding={handleOpenDetails} />}
      {view === 'new-project' && <ProjectForm users={users} onSaveProject={handleSaveProject} onNavigate={setView} />}
      {view === 'edit-project' && <ProjectForm users={users} initialProject={selectedProject} onSaveProject={handleSaveProject} onNavigate={setView} />}
      {view === 'findings' && <Findings findings={findings} projects={projects} users={users} onNavigate={setView} onOpenDetails={handleOpenDetails} />}
      {view === 'new-finding' && <FindingForm projects={projects} users={users} onSaveFinding={handleSaveFinding} onNavigate={setView} />}
      {view === 'edit-finding' && <FindingForm projects={projects} users={users} initialFinding={selectedFinding} onSaveFinding={handleSaveFinding} onNavigate={setView} />}
      {view === 'finding-details' && <FindingDetails finding={selectedFinding} projects={projects} users={users} onUpdateStatus={handleUpdateStatus} onNavigate={setView} />}
      {view === 'users' && <UsersPage users={users} onCreateUser={handleCreateUser} />}
      {view === 'notifications' && <Notifications notifications={notifications} projects={projects} />}
    </Layout>
  );
}

export default App;
