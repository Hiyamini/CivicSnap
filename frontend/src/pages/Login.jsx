import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';

export default function Login() {
  const { t } = useI18n();
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [signup, setSignup] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = signup ? await register(f.name, f.email, f.password) : await login(f.email, f.password);
      nav(`/users/${u.id}`); // login ayyaka mana profile
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form narrow" onSubmit={submit}>
      <h1>{signup ? t('login.registerTitle') : t('login.title')}</h1>
      {signup && (
        <label>{t('login.name')}<input value={f.name} onChange={set('name')} required maxLength={80} /></label>
      )}
      <label>{t('login.email')}<input type="email" value={f.email} onChange={set('email')} required /></label>
      <label>{t('login.password')}<input type="password" value={f.password} onChange={set('password')} required minLength={6} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>{signup ? t('login.registerSubmit') : t('login.submit')}</button>
      <button type="button" className="link" onClick={() => setSignup(!signup)}>
        {signup ? t('login.toLogin') : t('login.toRegister')}
      </button>
      <p className="hint">{t('login.demo')}</p>
    </form>
  );
}
