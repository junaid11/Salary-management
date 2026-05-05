export type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  email: string;
  employment_type: string;
  joined_at: string;
  created_at?: string;
  updated_at?: string;
};

export type EmployeePayload = {
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  email: string;
  employment_type: string;
  joined_at: string;
};

export type EmployeeListMeta = {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  per_page: number;
};

export type EmployeeListResponse = {
  data: Employee[];
  meta: EmployeeListMeta;
};

export type EmployeeListParams = {
  page?: number;
  per?: number;
  search?: string;
  country?: string;
  job_title?: string;
  sort?: "full_name" | "job_title" | "country" | "department" | "salary" | "joined_at" | "created_at";
  direction?: "asc" | "desc";
};

export type OverviewInsight = {
  total_headcount: number;
  average_salary: number;
  average_tenure_years: number;
  countries_count: number;
  departments_count: number;
};

export type CountrySalaryInsight = {
  country: string;
  min_salary: number;
  max_salary: number;
  average_salary: number;
  headcount: number;
};

export type TitleSalaryInsight = {
  job_title: string;
  average_salary: number;
  headcount: number;
};

export type HeadcountInsight = {
  country: string;
  headcount: number;
};

export type DepartmentDistributionInsight = {
  department: string;
  average_salary: number;
  headcount: number;
};
