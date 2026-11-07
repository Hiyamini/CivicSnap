import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import { LANGS, useI18n } from './i18n';
import Avatar from './components/Avatar';
import Feed from './pages/Feed';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Login from './pages/Login';
import Profile from './pages/Profile';
import IssueDetail from './pages/IssueDetail';

export default function App() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();

  return (
    <>
      <header className="top">
        <Link to="/" className="logo">📸 Civic Snap</Link>
        <nav>
          <NavLink to="/" end>{t('nav.feed')}</NavLink>
          <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
          <NavLink to="/report">{t('nav.report')}</NavLink>
        </nav>
        <div className="right">
          <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
            {LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          {user ? (
            <Link to={`/users/${user.id}`} title={user.name}><Avatar name={user.name} role={user.role} size={34} /></Link>
          ) : (
            <Link to="/login" className="btn btn-primary">{t('nav.login')}</Link>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:id" element={<Profile />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
        </Routes>
      </main>
    </>
  );
}
