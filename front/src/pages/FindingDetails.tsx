import { useCallback, useEffect, useRef, useState } from 'react';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../components/Badge';
import * as api from '../api';
import type { MediaItem } from '../api';
import type { Finding, Lookup, Project, User, View } from '../types';

type FindingDetailsProps = {
  finding?: Finding;
  projects: Project[];
  users: User[];
  statuses: Lookup[];
  onUpdateStatus: (findingId: string, statusId: string) => void;
  onNavigate: (view: View) => void;
};

export function FindingDetails({ finding, projects, statuses, onUpdateStatus, onNavigate }: FindingDetailsProps) {
  const [attachments, setAttachments] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadAttachments = useCallback(async () => {
    if (!finding) return;
    try { setAttachments(await api.getMediaForFinding(finding.id)); } catch { /* */ }
  }, [finding]);

  useEffect(() => { loadAttachments(); }, [loadAttachments]);

  if (!finding) {
    return (
      <section className="empty-state">
        <h1>Achado não selecionado</h1>
        <button className="primary-button" onClick={() => onNavigate('findings')}>Voltar para achados</button>
      </section>
    );
  }

  const project = projects.find((item) => item.id === finding.projectId);
  const currentStatusLookup = statuses.find((s) => s.name === finding.status);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !finding) return;
    setUploading(true);
    try {
      await api.uploadMedia(finding.id, file);
      await loadAttachments();
    } catch { /* */ }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(mediaId: string) {
    try {
      await api.deleteMedia(mediaId);
      await loadAttachments();
    } catch { /* */ }
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <span className="eyebrow">{finding.id.slice(0, 8)}</span>
          <h1>{finding.title}</h1>
          <p>{project?.title}</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={() => onNavigate('findings')}>Voltar</button>
          <button className="primary-button" onClick={() => onNavigate('edit-finding')}>Editar achado</button>
        </div>
      </header>

      <div className="details-grid">
        <article className="card details-main">
          <div className="meta-row">
            <SeverityBadge value={finding.severity} />
            <StatusBadge value={finding.status} />
            <span>{finding.category}</span>
          </div>
          <h2>Descrição</h2>
          <p>{finding.description}</p>
          <h2>Proposta de remediação</h2>
          <p>{finding.solution}</p>
        </article>

        <aside className="card details-side">
          <h2>Responsabilidade</h2>
          <dl>
            <div><dt>Reportante</dt><dd>{finding.reporter.name}</dd></div>
            <div><dt>Responsável</dt><dd>{finding.assigned.name}</dd></div>
          </dl>
          <label>
            Atualizar status
            <select
              value={currentStatusLookup?.id ?? ''}
              onChange={(e) => onUpdateStatus(finding.id, e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
        </aside>
      </div>

      {/* Anexos / Evidências */}
      <article className="card" style={{ marginTop: 18 }}>
        <div className="card-header">
          <div>
            <h2><Paperclip size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Anexos e Evidências</h2>
            <p className="muted-text">Imagens, capturas de tela e documentos associados a este achado.</p>
          </div>
          <label className="primary-button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Upload size={16} />
            {uploading ? 'Enviando...' : 'Enviar arquivo'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {attachments.length === 0 ? (
          <div className="empty-inline">Nenhum anexo. Clique em "Enviar arquivo" para adicionar evidências.</div>
        ) : (
          <div className="attachments-grid">
            {attachments.map((media) => {
              const imgUrl = `/v1/media/${media.id}`;
              return (
                <div className="attachment-card" key={media.id}>
                  <div className="attachment-img" onClick={() => setPreviewUrl(imgUrl)} style={{ cursor: 'pointer' }}>
                    <img src={imgUrl} alt={media.name} loading="lazy" />
                  </div>
                  <div className="attachment-info">
                    <small title={media.name}>{media.name.length > 20 ? media.name.slice(0, 17) + '...' : media.name}</small>
                    <button className="notification-delete" title="Remover anexo" onClick={() => handleDelete(media.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      {/* Preview modal */}
      {previewUrl && (
        <div className="preview-overlay" onClick={() => setPreviewUrl(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Preview" />
            <button className="ghost-button" onClick={() => setPreviewUrl(null)} style={{ marginTop: 12 }}>Fechar</button>
          </div>
        </div>
      )}
    </section>
  );
}
