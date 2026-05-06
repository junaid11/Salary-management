"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { SectionCard } from "@/components/ui/SectionCard";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { fetchEmployee } from "@/lib/api";

function routeIdFromParams(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const employeeId = routeIdFromParams(params?.id);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployee(employeeId as string),
    enabled: Boolean(employeeId),
  });

  if (isLoading) {
    return <SkeletonBlock className="h-96" />;
  }

  if (!employeeId || isError || !data) {
    return (
      <SectionCard title="Employee unavailable" eyebrow="Edit">
        <p className="text-sm text-[var(--muted)]">
          {error instanceof Error ? error.message : "Unable to fetch employee."}
        </p>
      </SectionCard>
    );
  }

  return <EmployeeForm mode="edit" initialEmployee={data} />;
}
