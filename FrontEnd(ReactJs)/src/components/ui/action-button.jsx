export function ActionButton({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    "action-button",
    `action-button--${variant}`,
    fullWidth ? "action-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
