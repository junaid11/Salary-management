import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";
import { fetchDashboardBaseData, fetchSalaryByTitle } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  fetchDashboardBaseData: jest.fn(),
  fetchSalaryByTitle: jest.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("InsightsDashboard", () => {
  it("renders overview metrics and lists", async () => {
    (fetchDashboardBaseData as jest.Mock).mockResolvedValue({
      overview: {
        total_headcount: 12,
        average_salary: 112000,
        average_tenure_years: 3.2,
        countries_count: 4,
        departments_count: 6,
      },
      salaryByCountry: [{ country: "USA", min_salary: 80000, max_salary: 220000, average_salary: 140000, headcount: 5 }],
      topEarners: [
        {
          id: 1,
          full_name: "Alice Product",
          job_title: "Product Manager",
          country: "USA",
          salary: 220000,
          department: "Product",
          email: "alice@company.com",
          employment_type: "full_time",
          joined_at: "2024-01-01",
        },
      ],
      outliers: [],
      headcountByCountry: [{ country: "USA", headcount: 5 }],
      departmentDistribution: [{ department: "Product", average_salary: 180000, headcount: 2 }],
    });
    (fetchSalaryByTitle as jest.Mock).mockResolvedValue([{ job_title: "Product Manager", average_salary: 180000, headcount: 2 }]);

    renderWithClient(<InsightsDashboard />);

    expect(await screen.findByText(/compensation intelligence at a glance/i)).toBeInTheDocument();
    expect(screen.getByText(/\$112,000/)).toBeInTheDocument();
    expect(screen.getByText(/alice product/i)).toBeInTheDocument();
    expect(screen.getByText(/no title-based compensation outliers/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /review employee records/i })).toBeInTheDocument();
  });
});
