import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
};

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <select
        className={cn(
          "rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[color:rgba(15,118,110,0.15)]",
          error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[color:rgba(185,28,28,0.12)]",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
    </label>
  );
}
