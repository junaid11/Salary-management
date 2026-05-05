import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { deleteEmployee, fetchEmployees } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  deleteEmployee: jest.fn(),
  fetchEmployees: jest.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("EmployeeTable", () => {
  it("renders employees from the API", async () => {
    (fetchEmployees as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          full_name: "Alice Product",
          job_title: "Product Manager",
          country: "USA",
          salary: 140000,
          department: "Product",
          email: "alice@company.com",
          employment_type: "full_time",
          joined_at: "2024-01-01",
        },
      ],
      meta: { current_page: 1, next_page: null, prev_page: null, total_pages: 1, total_count: 1, per_page: 50 },
    });

    renderWithClient(<EmployeeTable />);

    expect(await screen.findByText(/alice product/i)).toBeInTheDocument();
    expect(screen.getByText(/\$140,000/)).toBeInTheDocument();
  });

  it("confirms employee deletion", async () => {
    const user = userEvent.setup();
    (fetchEmployees as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          full_name: "Alice Product",
          job_title: "Product Manager",
          country: "USA",
          salary: 140000,
          department: "Product",
          email: "alice@company.com",
          employment_type: "full_time",
          joined_at: "2024-01-01",
        },
      ],
      meta: { current_page: 1, next_page: null, prev_page: null, total_pages: 1, total_count: 1, per_page: 50 },
    });
    (deleteEmployee as jest.Mock).mockResolvedValue(undefined);

    renderWithClient(<EmployeeTable />);
    await screen.findByText(/alice product/i);

    await user.click(screen.getByRole("button", { name: /delete alice product/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(deleteEmployee).toHaveBeenCalled();
      expect((deleteEmployee as jest.Mock).mock.calls[0][0]).toBe(1);
    });
  });
});
