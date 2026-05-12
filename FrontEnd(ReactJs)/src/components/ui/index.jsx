export function InputField({
  label,
  error,
  hint,
  icon: Icon,
  rightElement,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="label-text">{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <input
          className={`input-base ${Icon ? "pl-10" : ""} ${rightElement ? "pr-10" : ""} ${error ? "input-error" : ""}`}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  ...props
}) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "btn-secondary"
        : "btn-ghost";

  return (
    <button
      className={`${base} flex items-center justify-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}

export function Spinner({ size = 20, className = "" }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const isError = type === "error";

  return (
    <div className={isError ? "alert-error" : "alert-success"} role="alert">
      <span className="flex-shrink-0 text-lg">{isError ? "⚠️" : "✅"}</span>
      <span className="flex-1 text-sm">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function Divider({ text = "hoặc" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">{text}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export function AuthCard({ children, className = "" }) {
  return (
    <div className={`auth-card animate-slide-up w-full max-w-md ${className}`}>
      {children}
    </div>
  );
}

export function BrandLogo({ size = "md" }) {
  const sz = size === "sm" ? "text-xl" : "text-2xl md:text-3xl";

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-sm">FL</span>
      </div>
      <span
        className={`font-display font-bold ${sz} text-brand-800 tracking-tight`}
      >
        Flash<span className="text-teal-600">Learn</span>
      </span>
    </div>
  );
}
