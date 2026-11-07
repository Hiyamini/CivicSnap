import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import Avatar from '../components/Avatar';
import DeptTable from '../components/DeptTable';

/** Instagram laanti profile: citizen, officer, collector andariki same layout. */
export default function Profile() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [missing, setMissing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setP(null);
    setMissing(false);
    setEditing(false);
    api.profile(id).then(setP).catch(() => setMissing(true));
  }, [id]);

  if (missing) return <p>{t('profile.notFound')}</p>;
  if (!p) return <p>{t('common.loading')}</p>;

  const u = p.user;
  const own = user && user.id === u.id;

  const startEdit = () => { setName(u.name); setBio(u.bio); setEditing(true); };
  const save = async () => {
    try {
      const nu = await api.updateProfile(name, bio);
      setUser(nu);
      setP({ ...p, user: nu });
      setEditing(false);
    } catch (e) { alert(e.message || t('common.error')); }
  };

  return (
    <section>
      <div className="profile-head">
        <Avatar name={u.name} role={u.role} size={88} />
        <div className="profile-info">
          <h1>{u.name} <em className={`role role-${u.role}`}>{t('role.' + u.role)}</em></h1>
          {u.departmentCode && <p className="tag">{t('dept.' + u.departmentCode)}</p>}
          <div className="stats">
            <span><b>{p.posts}</b> {t('profile.posts')}</span>
            <span><b>{p.resolved}</b> {t('profile.resolved')}</span>
            <span>{t('profile.joined')} {new Date(p.joinedAt).toLocaleDateString(lang)}</span>
          </div>
          {editing ? (
            <div className="form">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={300} placeholder={t('profile.bio')} />
              <button className="btn btn-primary" onClick={save}>{t('profile.save')}</button>
            </div>
          ) : (
            <>
              <p className="bio">{u.bio}</p>
              {own && (
                <div className="row">
                  <button className="btn" onClick={startEdit}>{t('profile.edit')}</button>
                  <button className="btn" onClick={() => { logout(); nav('/'); }}>{t('nav.logout')}</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {u.role === 'COLLECTOR' && (
        <>
          <h2>{t('dashboard.title')}</h2>
          <DeptTable />
        </>
      )}

      <h2>{t('profile.posts')}</h2>
      {p.issues.length === 0 ? <p>{t('common.noPosts')}</p> : (
        <div className="grid">
          {p.issues.map((i) => (
            <Link key={i.id} to={`/issues/${i.id}`} className={`tile st-${i.status}`}>
              {i.mediaUrl && i.mediaType === 'image' ? <img src={i.mediaUrl} alt={i.title} loading="lazy" />
                : <span className="tile-text">{i.title}</span>}
              <span className="tile-badge">{t('status.' + i.status)}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
