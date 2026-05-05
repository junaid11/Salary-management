"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchDashboardBaseData, fetchSalaryByTitle } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { Select } from "@/components/ui/Select";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { SalaryInsightCard } from "./SalaryInsightCard";

function activeCountry(
  countries: { country: string }[] | undefined,
  selectedCountry: string,
) {
  if (!countries?.length) {
    return "";
  }

  return countries.some((item) => item.country === selectedCountry)
    ? selectedCountry
    : countries[0].country;
}

export function InsightsDashboard() {
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const baseQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardBaseData,
  });

  const titleQuery = useQuery({
    queryKey: ["dashboard", "titleBreakdown", activeCountry(baseQuery.data?.salaryByCountry, selectedCountry)],
    queryFn: () => fetchSalaryByTitle(activeCountry(baseQuery.data?.salaryByCountry, selectedCountry)),
    enabled: Boolean(activeCountry(baseQuery.data?.salaryByCountry, selectedCountry)),
  });

  if (baseQuery.isLoading) {
    return (
      <div className="grid gap-6">
        <SkeletonBlock className="h-36" />
        <div className="grid gap-6 xl:grid-cols-2">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-96" />
        </div>
      </div>
    );
  }

  if (baseQuery.isError || !baseQuery.data) {
    return (
      <SectionCard eyebrow="Insights" title="Dashboard unavailable">
        <p className="text-sm text-[var(--danger)]">
          {baseQuery.error instanceof Error ? baseQuery.error.message : "Unable to load dashboard metrics."}
        </p>
      </SectionCard>
    );
  }

  const { overview, salaryByCountry, topEarners, outliers, headcountByCountry, departmentDistribution } = baseQuery.data;
  const focusedCountry = activeCountry(salaryByCountry, selectedCountry);

  return (
    <div className="grid gap-6">
      <SectionCard eyebrow="HR Command Center" title="Compensation intelligence at a glance">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SalaryInsightCard label="Average Salary" value={overview.average_salary} />
          <SalaryInsightCard formatter="number" label="Total Headcount" tone="accent" value={overview.total_headcount} />
          <SalaryInsightCard formatter="number" label="Countries" value={overview.countries_count} />
          <SalaryInsightCard formatter="number" label="Departments" tone="accent" value={overview.departments_count} />
          <SalaryInsightCard formatter="number" label="Avg Tenure (years)" value={overview.average_tenure_years} />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard eyebrow="Market View" title="Salary by country">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[color:rgba(31,41,55,0.03)] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-4 font-medium">Country</th>
                  <th className="px-5 py-4 font-medium">Min</th>
                  <th className="px-5 py-4 font-medium">Average</th>
                  <th className="px-5 py-4 font-medium">Max</th>
                  <th className="px-5 py-4 font-medium">Headcount</th>
                </tr>
              </thead>
              <tbody>
                {salaryByCountry.map((item) => (
                  <tr key={item.country} className="border-t border-[var(--line)]">
                    <td className="px-5 py-4 font-medium">{item.country}</td>
                    <td className="px-5 py-4">{formatCurrency(item.min_salary)}</td>
                    <td className="px-5 py-4">{formatCurrency(item.average_salary)}</td>
                    <td className="px-5 py-4">{formatCurrency(item.max_salary)}</td>
                    <td className="px-5 py-4">{item.headcount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Drilldown" title="Salary by title within a country">
          <Select
            label="Country focus"
            onChange={(event) => setSelectedCountry(event.target.value)}
            options={salaryByCountry.map((item) => ({ label: item.country, value: item.country }))}
            value={focusedCountry}
          />
          <div className="mt-5 grid gap-3">
            {titleQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => <SkeletonBlock key={index} className="h-14 rounded-2xl" />)
            ) : titleQuery.isError ? (
              <p className="text-sm text-[var(--danger)]">
                {titleQuery.error instanceof Error ? titleQuery.error.message : "Unable to load title metrics."}
              </p>
            ) : (
              titleQuery.data?.map((item) => (
                <div key={item.job_title} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
                  <div>
                    <p className="font-medium">{item.job_title}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.headcount} employees</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.average_salary)}</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Department Distribution" title="Average salary by department">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution}>
                <CartesianGrid stroke="rgba(31,41,55,0.08)" vertical={false} />
                <XAxis dataKey="department" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Bar dataKey="average_salary" fill="#0f766e" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Org Distribution" title="Headcount by country">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountByCountry}>
                <CartesianGrid stroke="rgba(31,41,55,0.08)" vertical={false} />
                <XAxis dataKey="country" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="headcount" fill="#c2410c" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Top Earners" title="Highest paid employees">
          <div className="grid gap-3">
            {topEarners.map((employee, index) => (
              <div key={employee.id} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
                <div>
                  <p className="font-medium">
                    {index + 1}. {employee.full_name}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {employee.job_title} · {employee.country}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(employee.salary)}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Band Outliers" title="Employees paid 2x above same-title peers">
          <div className="grid gap-3">
            {outliers.length ? (
              outliers.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
                  <div>
                    <p className="font-medium">{employee.full_name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {employee.job_title} · {employee.department}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(employee.salary)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
                No title-based compensation outliers were detected in the current dataset.
              </div>
            )}
          </div>
          <div className="mt-5">
            <Button
              asChild
              className="gap-2 bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]"
              href="/employees"
            >
              <>
                <span>Review employee records</span>
                <ArrowRight className="h-4 w-4" />
              </>
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
