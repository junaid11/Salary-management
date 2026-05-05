import { BriefcaseBusiness, CalendarRange, Globe2, Mail, Wallet } from "lucide-react";
import { Employee } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SectionCard } from "@/components/ui/SectionCard";

const details = (employee: Employee) => [
  { label: "Job Title", value: employee.job_title, icon: BriefcaseBusiness },
  { label: "Country", value: employee.country, icon: Globe2 },
  { label: "Salary", value: formatCurrency(employee.salary), icon: Wallet },
  { label: "Department", value: employee.department, icon: BriefcaseBusiness },
  { label: "Employment Type", value: employee.employment_type.replace("_", " "), icon: BriefcaseBusiness },
  { label: "Joined", value: formatDate(employee.joined_at), icon: CalendarRange },
  { label: "Email", value: employee.email, icon: Mail },
];

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <SectionCard eyebrow="Employee Detail" title={employee.full_name}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {details(employee).map((detail) => {
          const Icon = detail.icon;

          return (
            <div key={detail.label} className="rounded-3xl border border-[var(--line)] bg-white/75 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[color:rgba(15,118,110,0.08)] p-3 text-[var(--brand)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{detail.label}</p>
                  <p className="mt-1 text-base font-semibold capitalize">{detail.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
