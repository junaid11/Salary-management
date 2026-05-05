"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { COUNTRIES, DEPARTMENTS, EMPLOYMENT_TYPES, JOB_TITLES } from "@/lib/constants";
import { ApiError, createEmployee, updateEmployee } from "@/lib/api";
import { Employee, EmployeePayload } from "@/lib/types";
import { toDateInputValue } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionCard } from "@/components/ui/SectionCard";
import { Select } from "@/components/ui/Select";

const employeeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  job_title: z.string().min(1, "Job title is required"),
  country: z.string().min(1, "Country is required"),
  salary: z.number().positive("Salary must be greater than zero"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Enter a valid email address"),
  employment_type: z.string().min(1, "Employment type is required"),
  joined_at: z.string().min(1, "Joined date is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

function mapOptions(items: readonly string[]) {
  return items.map((item) => ({
    label: item.replace("_", " "),
    value: item,
  }));
}

export function EmployeeForm({
  mode,
  initialEmployee,
}: {
  mode: "create" | "edit";
  initialEmployee?: Employee;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      full_name: initialEmployee?.full_name ?? "",
      job_title: initialEmployee?.job_title ?? JOB_TITLES[0],
      country: initialEmployee?.country ?? COUNTRIES[0],
      salary: initialEmployee?.salary ?? 0,
      department: initialEmployee?.department ?? DEPARTMENTS[0],
      email: initialEmployee?.email ?? "",
      employment_type: initialEmployee?.employment_type ?? EMPLOYMENT_TYPES[0],
      joined_at: initialEmployee ? toDateInputValue(initialEmployee.joined_at) : "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const payload: EmployeePayload = {
        ...values,
      };

      if (mode === "edit" && initialEmployee) {
        return updateEmployee(initialEmployee.id, payload);
      }

      return createEmployee(payload);
    },
    onSuccess: async (employee) => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      await queryClient.invalidateQueries({ queryKey: ["employee", String(employee.id)] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.push(`/employees/${employee.id}`);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof EmployeeFormValues, {
            type: "server",
            message: messages.join(", "),
          });
        });
      }
    },
  });

  const submitLabel = mode === "create" ? "Create employee" : "Save changes";

  return (
    <SectionCard
      eyebrow={mode === "create" ? "New Employee" : "Edit Employee"}
      title={mode === "create" ? "Add a new employee" : `Update ${initialEmployee?.full_name ?? "employee"}`}
    >
      <form
        className="grid gap-5"
        onSubmit={form.handleSubmit((values) => {
          mutation.mutate(values);
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" error={form.formState.errors.full_name?.message} {...form.register("full_name")} />
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <Select label="Job title" error={form.formState.errors.job_title?.message} options={mapOptions(JOB_TITLES)} {...form.register("job_title")} />
          <Select label="Country" error={form.formState.errors.country?.message} options={mapOptions(COUNTRIES)} {...form.register("country")} />
          <Input
            label="Salary"
            error={form.formState.errors.salary?.message}
            min="0"
            step="0.01"
            type="number"
            {...form.register("salary", { valueAsNumber: true })}
          />
          <Select label="Department" error={form.formState.errors.department?.message} options={mapOptions(DEPARTMENTS)} {...form.register("department")} />
          <Select
            label="Employment type"
            error={form.formState.errors.employment_type?.message}
            options={mapOptions(EMPLOYMENT_TYPES)}
            {...form.register("employment_type")}
          />
          <Input label="Joined at" error={form.formState.errors.joined_at?.message} type="date" {...form.register("joined_at")} />
        </div>

        {mutation.isError && !(mutation.error instanceof ApiError && mutation.error.fieldErrors) ? (
          <p className="rounded-2xl border border-[color:rgba(185,28,28,0.2)] bg-red-50 px-4 py-3 text-sm text-[var(--danger)]">
            {mutation.error instanceof Error ? mutation.error.message : "Unable to save employee."}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Saving..." : submitLabel}
          </Button>
          <Button asChild href={mode === "edit" && initialEmployee ? `/employees/${initialEmployee.id}` : "/employees"} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
