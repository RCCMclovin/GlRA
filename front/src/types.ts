export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: string;
};

export type Finding = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  solution: string;
  severity: string;
  status: string;
  category: string;
  reporter: { id: string; name: string };
  assigned: { id: string; name: string };
};

export type Notification = {
  id: number;
  content: string;
  read: boolean;
  receiverId: string;
};

export type Lookup = {
  id: string;
  name: string;
};

export type View =
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'new-project'
  | 'edit-project'
  | 'project-details'
  | 'findings'
  | 'new-finding'
  | 'edit-finding'
  | 'finding-details'
  | 'users'
  | 'notifications';
