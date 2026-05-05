"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { COUNTRIES, JOB_TITLES } from "@/lib/constants";
import { deleteEmployee, fetchEmployees } from "@/lib/api";
import { EmployeeListParams } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionCard } from "@/components/ui/SectionCard";
import { Select } from "@/components/ui/Select";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const sortableColumns = [
  { key: "full_name", label: "Name" },
  { key: "job_title", label: "Role" },
  { key: "country", label: "Country" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary" },
  { key: "joined_at", label: "Joined" },
] as const;

export function EmployeeTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [sort, setSort] = useState<EmployeeListParams["sort"]>("created_at");
  const [direction, setDirection] = useState<EmployeeListParams["direction"]>("desc");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; fullName: string } | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(deferredSearch.trim());
      startTransition(() => setPage(1));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [deferredSearch]);

  const params = useMemo(
    () => ({
      page,
      per: 50,
      search: debouncedSearch || undefined,
      country: country || undefined,
      job_title: jobTitle || undefined,
      sort,
      direction,
    }),
    [country, debouncedSearch, direction, jobTitle, page, sort],
  );

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["employees", params],
    queryFn: () => fetchEmployees(params),
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setDeleteTarget(null);
    },
  });

  const toggleSort = (column: EmployeeListParams["sort"]) => {
    startTransition(() => {
      if (sort === column) {
        setDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSort(column);
        setDirection("asc");
      }
      setPage(1);
    });
  };

  return (
    <div className="grid gap-6">
      <SectionCard eyebrow="Employee Directory" title="Browse and maintain salary records">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid flex-1 gap-4 md:grid-cols-3">
            <Input
              className="pl-11"
              label="Search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, title, or country"
              value={search}
            />
            <div className="pointer-events-none relative -mb-12 ml-4 mt-9 text-[var(--muted)]">
              <Search className="h-4 w-4" />
            </div>
            <Select
              label="Country"
              onChange={(event) => {
                startTransition(() => {
                  setCountry(event.target.value);
                  setPage(1);
                });
              }}
              options={[{ label: "All countries", value: "" }, ...COUNTRIES.map((value) => ({ label: value, value }))]}
              value={country}
            />
            <Select
              label="Job title"
              onChange={(event) => {
                startTransition(() => {
                  setJobTitle(event.target.value);
                  setPage(1);
                });
              }}
              options={[{ label: "All job titles", value: "" }, ...JOB_TITLES.map((value) => ({ label: value, value }))]}
              value={jobTitle}
            />
          </div>
          <Button asChild href="/employees/new">
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add employee
            </>
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white/80">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 text-sm text-[var(--muted)]">
            <span>{data ? `${data.meta.total_count} employees matched` : "Loading employees"}</span>
            <span>{isFetching ? "Refreshing dataset..." : "Current page is server-backed and paginated"}</span>
          </div>

          {isLoading ? (
            <div className="grid gap-3 p-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-14 rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-5 text-sm text-[var(--danger)]">{error instanceof Error ? error.message : "Unable to load employees."}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[color:rgba(31,41,55,0.03)] text-[var(--muted)]">
                  <tr>
                    {sortableColumns.map((column) => (
                      <th key={column.key} className="px-5 py-4 font-medium">
                        <button className="inline-flex items-center gap-2" onClick={() => toggleSort(column.key)}>
                          {column.label}
                          <ArrowDownUp className="h-4 w-4" />
                        </button>
                      </th>
                    ))}
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((employee) => (
                    <tr key={employee.id} className="border-t border-[var(--line)]">
                      <td className="px-5 py-4 font-medium">
                        <Link className="transition hover:text-[var(--brand)]" href={`/employees/${employee.id}`}>
                          {employee.full_name}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{employee.job_title}</td>
                      <td className="px-5 py-4">{employee.country}</td>
                      <td className="px-5 py-4">{employee.department}</td>
                      <td className="px-5 py-4">{formatCurrency(employee.salary)}</td>
                      <td className="px-5 py-4">{formatDate(employee.joined_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Button aria-label={`Edit ${employee.full_name}`} asChild href={`/employees/${employee.id}/edit`} variant="ghost">
                            <PencilLine className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label={`Delete ${employee.full_name}`}
                            onClick={() => setDeleteTarget({ id: employee.id, fullName: employee.full_name })}
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-[var(--danger)]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            Page {data?.meta.current_page ?? page} of {data?.meta.total_pages ?? 1}
          </p>
          <div className="flex gap-3">
            <Button
              disabled={!data?.meta.prev_page}
              onClick={() => startTransition(() => setPage((current) => Math.max(current - 1, 1)))}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={!data?.meta.next_page}
              onClick={() => startTransition(() => setPage((current) => current + 1))}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      </SectionCard>

      {deleteTarget ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/20 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-[var(--danger)]">Confirm Delete</p>
            <h3 className="mt-2 text-xl font-semibold">Remove {deleteTarget.fullName}?</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">This will permanently delete the employee record from the dataset.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => setDeleteTarget(null)} variant="secondary">
                Cancel
              </Button>
              <Button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                variant="danger"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
