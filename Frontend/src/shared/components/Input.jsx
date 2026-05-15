const Input = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  ...props
}) => (
  <div>
    {label && (
      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${className}`}
      {...props}
    />
  </div>
);

export default Input;
