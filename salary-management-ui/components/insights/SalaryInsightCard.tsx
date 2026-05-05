import { cn, formatCurrency } from "@/lib/utils";

export function SalaryInsightCard({
  label,
  value,
  tone = "brand",
  formatter = "currency",
}: {
  label: string;
  value: number;
  tone?: "brand" | "accent";
  formatter?: "currency" | "number";
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border p-5 shadow-sm",
        tone === "brand"
          ? "border-[color:rgba(15,118,110,0.15)] bg-[color:rgba(15,118,110,0.08)]"
          : "border-[color:rgba(194,65,12,0.14)] bg-[color:rgba(194,65,12,0.08)]",
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold">
        {formatter === "currency" ? formatCurrency(value) : new Intl.NumberFormat().format(value)}
      </p>
    </div>
  );
}
