import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import MapView from '../components/MapView';
import IssueCard from '../components/IssueCard';

export default function Report() {
  const { t } = useI18n();
  const { user, ready } = useAuth();
  const nav = useNavigate();
  const [depts, setDepts] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);
  const [loc, setLoc] = useState(null);
  const [dups, setDups] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.departments().then((d) => { setDepts(d); if (d[0]) setDeptId(String(d[0].id)); }); }, []);

  // Duplicate check: department leda location maarinappudalla, daggara unna issues techukuntam
  useEffect(() => {
    if (!deptId || !loc) { setDups([]); return; }
    api.nearby(deptId, loc.lat, loc.lng).then(setDups).catch(() => setDups([]));
  }, [deptId, loc]);

  if (ready && !user) return <Navigate to="/login" replace />;

  const gps = () => {
    if (!navigator.geolocation) { setError('GPS not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setError('Could not get GPS. Tap the map instead.'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loc) { setError(t('report.needLocation')); return; }
    const form = new FormData();
    form.append('title', title);
    form.append('description', desc);
    form.append('departmentId', deptId);
    form.append('latitude', loc.lat);
    form.append('longitude', loc.lng);
    form.append('address', address);
    if (file) form.append('file', file);
    setBusy(true);
    try {
      const issue = await api.createIssue(form);
      nav(`/issues/${issue.id}`);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const replaceDup = (u) => setDups((list) => list.map((i) => (i.id === u.id ? u : i)));

  return (
    <form className="form" onSubmit={submit}>
      <h1>{t('report.title')}</h1>

      <label>{t('report.dept')}
        <select value={deptId} onChange={(e) => setDeptId(e.target.value)}>
          {depts.map((d) => <option key={d.id} value={d.id}>{t('dept.' + d.code)}</option>)}
        </select>
      </label>
      <label>{t('report.issueTitle')}<input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={150} /></label>
      <label>{t('report.desc')}<textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} maxLength={2000} /></label>
      <label>{t('report.media')}
        <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={(e) => setFile(e.target.files[0] || null)} />
      </label>

      <p className="hint">{t('report.pick')}</p>
      <button type="button" className="btn" onClick={gps}>📍 {t('report.gps')}</button>
      <MapView mode="pick" value={loc} onPick={(lat, lng) => setLoc({ lat, lng })} height={300} />
      <label>{t('report.address')}<input value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} /></label>

      {dups.length > 0 && (
        <div className="dup">
          <h3>⚠️ {t('report.dupTitle')}</h3>
          <p>{t('report.dupHelp')}</p>
          {dups.map((i) => <IssueCard key={i.id} issue={i} onChange={replaceDup} />)}
        </div>
      )}

      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? t('report.posting') : t('report.submit')}</button>
    </form>
  );
}
