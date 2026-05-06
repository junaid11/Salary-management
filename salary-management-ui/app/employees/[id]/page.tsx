"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { fetchEmployee } from "@/lib/api";

function routeIdFromParams(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employeeId = routeIdFromParams(params?.id);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployee(employeeId as string),
    enabled: Boolean(employeeId),
  });

  if (isLoading) {
    return <SkeletonBlock className="h-72" />;
  }

  if (!employeeId || isError || !data) {
    return (
      <SectionCard title="Employee unavailable" eyebrow="Lookup">
        <p className="text-sm text-[var(--muted)]">
          {error instanceof Error ? error.message : "Unable to fetch employee."}
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Employee Profile</p>
          <h1 className="mt-2 text-3xl font-semibold">{data.full_name}</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild href="/employees" variant="secondary">
            Back to list
          </Button>
          <Button asChild href={`/employees/${employeeId}/edit`}>
            Edit employee
          </Button>
        </div>
      </div>
      <EmployeeCard employee={data} />
    </div>
  );
}
