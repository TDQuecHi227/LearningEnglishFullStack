export function FormField({
  label,
  hint,
  error,
  className = "",
  as = "input",
  children,
  ...props
}) {
  const classes = ["form-field", className].filter(Boolean).join(" ");

  const controlProps = {
    className: `form-control${error ? " form-control--error" : ""}`,
    ...props,
  };

  const control =
    as === "textarea" ? (
      <textarea {...controlProps} />
    ) : as === "select" ? (
      <select {...controlProps}>{children}</select>
    ) : (
      <input {...controlProps} />
    );

  return (
    <label className={classes}>
      <span className="form-field__label">{label}</span>
      {control}
      {hint ? <span className="form-field__hint">{hint}</span> : null}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
