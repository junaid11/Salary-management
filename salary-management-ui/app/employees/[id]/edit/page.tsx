"use client";

import { useQuery } from "@tanstack/react-query";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { SectionCard } from "@/components/ui/SectionCard";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { fetchEmployee } from "@/lib/api";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", params.id],
    queryFn: () => fetchEmployee(params.id),
  });

  if (isLoading) {
    return <SkeletonBlock className="h-96" />;
  }

  if (isError || !data) {
    return (
      <SectionCard title="Employee unavailable" eyebrow="Edit">
        <p className="text-sm text-[var(--muted)]">{error instanceof Error ? error.message : "Unable to fetch employee."}</p>
      </SectionCard>
    );
  }

  return <EmployeeForm mode="edit" initialEmployee={data} />;
}
