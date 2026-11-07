import { useEffect, useState } from 'react';
import { api } from '../api';
import { useI18n } from '../i18n';

/** Prathi department: total / pending / in progress / resolved + progress bar. Login avasaram ledu. */
export default function DeptTable() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);

  useEffect(() => { api.dashboard().then(setRows).catch(() => setRows([])); }, []);
  if (!rows) return <p>{t('common.loading')}</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('dashboard.dept')}</th><th>{t('dashboard.total')}</th><th>{t('dashboard.open')}</th>
            <th>{t('dashboard.inProgress')}</th><th>{t('dashboard.resolved')}</th><th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const pct = r.total ? Math.round((r.resolved / r.total) * 100) : 0;
            return (
              <tr key={r.id}>
                <td>{t('dept.' + r.code)}</td><td>{r.total}</td><td>{r.open}</td><td>{r.inProgress}</td><td>{r.resolved}</td>
                <td className="bar-cell">
                  <div className="bar"><span style={{ width: pct + '%' }} /></div>
                  <small>{pct}%</small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
