import { useEffect, useState } from 'react';
import { api } from '../api';
import { useI18n } from '../i18n';
import IssueCard, { STATUSES } from '../components/IssueCard';

export default function Feed() {
  const { t } = useI18n();
  const [depts, setDepts] = useState([]);
  const [dept, setDept] = useState('');
  const [status, setStatus] = useState('');
  const [issues, setIssues] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.departments().then(setDepts).catch(() => {}); }, []);
  useEffect(() => {
    setIssues(null);
    api.issues(dept, status).then(setIssues).catch((e) => { setError(e.message); setIssues([]); });
  }, [dept, status]);

  const replace = (u) => setIssues((list) => list.map((i) => (i.id === u.id ? u : i)));

  return (
    <section>
      <h1>{t('feed.title')}</h1>
      <div className="filters">
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">{t('filter.allDepts')}</option>
          {depts.map((d) => <option key={d.id} value={d.id}>{t('dept.' + d.code)}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t('filter.allStatus')}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t('status.' + s)}</option>)}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {!issues ? <p>{t('common.loading')}</p>
        : issues.length === 0 ? <p>{t('noIssues')}</p>
        : issues.map((i) => <IssueCard key={i.id} issue={i} onChange={replace} />)}
    </section>
  );
}
