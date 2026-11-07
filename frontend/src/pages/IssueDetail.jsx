import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useI18n } from '../i18n';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';

export default function IssueDetail() {
  const { id } = useParams();
  const { t } = useI18n();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setIssue(null);
    api.issue(id).then(setIssue).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!issue) return <p>{t('common.loading')}</p>;
  return (
    <section>
      <IssueCard issue={issue} onChange={setIssue} />
      <MapView mode="show" issues={[issue]} height={260} />
    </section>
  );
}
