export function AuthShell({ title, children }) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        {children}
      </div>
    </section>
  );
}
