import {
  CountrySalaryInsight,
  DepartmentDistributionInsight,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeePayload,
  HeadcountInsight,
  OverviewInsight,
  TitleSalaryInsight,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type ApiErrorPayload = {
  error?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new ApiError(errorPayload.error ?? "Request failed", errorPayload.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function queryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchEmployees(params: EmployeeListParams): Promise<EmployeeListResponse> {
  return request<EmployeeListResponse>(`/api/v1/employees${queryString(params)}`);
}

export async function fetchEmployee(id: string | number): Promise<Employee> {
  const response = await request<{ data: Employee }>(`/api/v1/employees/${id}`);
  return response.data;
}

export async function createEmployee(payload: EmployeePayload): Promise<Employee> {
  const response = await request<{ data: Employee }>("/api/v1/employees", {
    method: "POST",
    body: JSON.stringify({ employee: payload }),
  });

  return response.data;
}

export async function updateEmployee(id: number, payload: EmployeePayload): Promise<Employee> {
  const response = await request<{ data: Employee }>(`/api/v1/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ employee: payload }),
  });

  return response.data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await request(`/api/v1/employees/${id}`, {
    method: "DELETE",
  });
}

export async function fetchSalaryByTitle(country: string): Promise<TitleSalaryInsight[]> {
  const response = await request<{ data: TitleSalaryInsight[] }>(`/api/v1/insights/salary_by_title${queryString({ country })}`);
  return response.data;
}

export async function fetchDashboardBaseData(): Promise<{
  overview: OverviewInsight;
  salaryByCountry: CountrySalaryInsight[];
  topEarners: Employee[];
  outliers: Employee[];
  headcountByCountry: HeadcountInsight[];
  departmentDistribution: DepartmentDistributionInsight[];
}> {
  const [overview, salaryByCountry, topEarners, outliers, headcountByCountry, departmentDistribution] = await Promise.all([
    request<{ data: OverviewInsight }>("/api/v1/insights/overview"),
    request<{ data: CountrySalaryInsight[] }>("/api/v1/insights/salary_by_country"),
    request<{ data: Employee[] }>("/api/v1/insights/top_earners"),
    request<{ data: Employee[] }>("/api/v1/insights/outliers"),
    request<{ data: HeadcountInsight[] }>("/api/v1/insights/headcount_by_country"),
    request<{ data: DepartmentDistributionInsight[] }>("/api/v1/insights/department_distribution"),
  ]);

  return {
    overview: overview.data,
    salaryByCountry: salaryByCountry.data,
    topEarners: topEarners.data,
    outliers: outliers.data,
    headcountByCountry: headcountByCountry.data,
    departmentDistribution: departmentDistribution.data,
  };
}
