import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import Avatar from './Avatar';

export const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

/** Insta post laanti card. onChange(updatedIssue) tho parent list update avutundi. */
export default function IssueCard({ issue, onChange }) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();

  const canUpdate =
    user && (user.role === 'COLLECTOR' || (user.role === 'OFFICER' && user.departmentId === issue.departmentId));

  const run = async (fn) => {
    try { onChange(await fn()); } catch (e) { alert(e.message || t('common.error')); }
  };
  const upvote = () => (user ? run(() => api.upvote(issue.id)) : nav('/login'));

  return (
    <article className="card">
      <header className="card-head">
        <Link to={`/users/${issue.authorId}`} className="who">
          <Avatar name={issue.authorName} role={issue.authorRole} />
          <span>
            <strong>{issue.authorName}</strong>
            {issue.authorRole !== 'CITIZEN' && <em className={`role role-${issue.authorRole}`}>{t('role.' + issue.authorRole)}</em>}
            <small>{new Date(issue.createdAt).toLocaleString(lang)}</small>
          </span>
        </Link>
        <span className={`badge st-${issue.status}`}>{t('status.' + issue.status)}</span>
      </header>

      {issue.mediaUrl && issue.mediaType === 'video' && <video src={issue.mediaUrl} controls className="media" />}
      {issue.mediaUrl && issue.mediaType === 'image' && <img src={issue.mediaUrl} alt={issue.title} className="media" loading="lazy" />}

      <div className="card-body">
        <h3><Link to={`/issues/${issue.id}`}>{issue.title}</Link></h3>
        {issue.description && <p>{issue.description}</p>}
        <p className="meta">
          <span className="tag">{t('dept.' + issue.departmentCode)}</span>
          {issue.address && <span>📍 {issue.address}</span>}
        </p>
      </div>

      <footer className="card-foot">
        <button className={`btn ${issue.upvotedByMe ? 'btn-on' : ''}`} onClick={upvote}>
          ▲ {issue.upvotedByMe ? t('upvoted') : t('upvote')} · {issue.upvotes}
        </button>
        {canUpdate && (
          <label className="update">
            {t('issue.updateStatus')}:{' '}
            <select value={issue.status} onChange={(e) => run(() => api.setStatus(issue.id, e.target.value))}>
              {STATUSES.map((s) => <option key={s} value={s}>{t('status.' + s)}</option>)}
            </select>
          </label>
        )}
      </footer>
    </article>
  );
}
