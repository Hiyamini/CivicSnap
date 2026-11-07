import { useEffect, useState } from 'react';
import { api } from '../api';
import { useI18n } from '../i18n';
import DeptTable from '../components/DeptTable';
import MapView from '../components/MapView';

export default function Dashboard() {
  const { t } = useI18n();
  const [issues, setIssues] = useState([]);
  useEffect(() => { api.issues().then(setIssues).catch(() => {}); }, []);

  return (
    <section>
      <h1>{t('dashboard.title')}</h1>
      <DeptTable />
      <h2>{t('dashboard.map')}</h2>
      <MapView mode="show" issues={issues} height={380} />
    </section>
  );
}
