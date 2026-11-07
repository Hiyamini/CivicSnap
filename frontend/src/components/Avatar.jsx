// Instagram laanti gola avatar: peru modati aksharam. Role batti rangu maaruthundi.
const COLORS = { CITIZEN: '#5b6b8c', OFFICER: '#0f766e', COLLECTOR: '#9a3412' };

export default function Avatar({ name = '?', role = 'CITIZEN', size = 40 }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.42, background: COLORS[role] || COLORS.CITIZEN }}
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
