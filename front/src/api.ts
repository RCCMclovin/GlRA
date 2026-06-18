import type { Finding, Lookup, Notification, Project, User } from './types';

const API = 'https://glraback.rcchome.com.br/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let msg = text || `Erro ${res.status}`;
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed[0]?.message) {
        msg = parsed.map((e: { message: string }) => e.message).join('. ');
      } else if (parsed?.msg) {
        msg = parsed.msg;
      }
    } catch { /* not JSON */ }
    throw new Error(msg);
  }
  const text = await res.text();
  if (!text) return null as T;
  try { return JSON.parse(text); } catch { return null as T; }
}

// Auth
export function login(email: string, password: string) {
  return request<{ msg: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function signup(name: string, email: string, password: string) {
  return request<void>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function apiLogout() {
  return request<void>('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return request<User>('/auth/me');
}

// Projects
export function getMyProjects() {
  return request<Project[]>('/projectAccess');
}

export function getProject(id: string) {
  return request<Project>(`/project/${id}`);
}

export function createProject(data: { title: string; description: string }) {
  return request<void>('/project', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProject(id: string, data: { title: string; description: string }) {
  return request<void>(`/project/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProject(id: string) {
  return request<void>(`/project/${id}`, { method: 'DELETE' });
}

// Project Access
export function getProjectUsers(projectId: string) {
  return request<User[]>(`/projectAccess/${projectId}`);
}

export function grantAccess(projectId: string, userId: string) {
  return request<void>(`/projectAccess/p/${projectId}/u/${userId}`, { method: 'POST' });
}

export function revokeAccess(projectId: string, userId: string) {
  return request<void>(`/projectAccess/p/${projectId}/u/${userId}`, { method: 'DELETE' });
}

// Findings
export function getProjectFindings(projectId: string) {
  return request<Finding[]>(`/finding/p/${projectId}`);
}

export function getFinding(id: string) {
  return request<Finding>(`/finding/${id}`);
}

export type CreateFindingPayload = {
  title: string;
  solution: string;
  description: string;
  assignedId: string;
  statusId: string;
  severityId: string;
  categoryId: string;
  projectId: string;
};

export function createFinding(data: CreateFindingPayload) {
  return request<void>('/finding', { method: 'POST', body: JSON.stringify(data) });
}

export type UpdateFindingPayload = {
  title: string;
  solution: string;
  description: string;
  assignedId: string;
  statusId: string;
  severityId: string;
  categoryId: string;
};

export function updateFinding(id: string, data: UpdateFindingPayload) {
  return request<void>(`/finding/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteFinding(id: string) {
  return request<void>(`/finding/${id}`, { method: 'DELETE' });
}

export type SearchFindingPayload = {
  title?: string;
  categoryId?: string;
  severityId?: string;
  statusId?: string;
  assignedId?: string;
  reporterId?: string;
};

export function searchFindings(projectId: string, filters: SearchFindingPayload) {
  return request<Finding[]>(`/finding/search/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(filters),
  });
}

export function searchProjects(title: string) {
  return request<Project[]>('/project/search', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

// Users
export function getUsers() {
  return request<User[]>('/user');
}

export function getUser(id: string) {
  return request<User>(`/user/${id}`);
}

export function createUser(data: { name: string; email: string; password: string }) {
  return request<void>('/user', { method: 'POST', body: JSON.stringify(data) });
}

export function searchUsers(str: string) {
  return request<User[]>('/user/search', { method: 'POST', body: JSON.stringify({ str }) });
}

// Lookups
export function getSeverities() {
  return request<Lookup[]>('/findingSeverity');
}

export function getStatuses() {
  return request<Lookup[]>('/findingStatus');
}

export function getCategories() {
  return request<Lookup[]>('/findingTypes');
}

// Notifications
export function getNotifications() {
  return request<Notification[]>('/notification');
}

export function toggleNotificationRead(id: number) {
  return request<void>(`/notification/${id}`, { method: 'PUT' });
}

export function deleteNotification(id: number) {
  return request<void>(`/notification/${id}`, { method: 'DELETE' });
}

// Media
export type MediaItem = {
  id: string;
  name: string;
  link: string;
  createdAt: string;
};

export async function getMediaForFinding(findingId: string) {
  return request<MediaItem[]>(`/media/index/${findingId}`);
}

export async function uploadMedia(findingId: string, file: File): Promise<MediaItem> {
  const res = await fetch(`${API}/media/${findingId}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload falhou: ${res.status}`);
  return res.json();
}

export async function deleteMedia(mediaId: string) {
  return request<void>(`/media/${mediaId}`, { method: 'DELETE' });
}
