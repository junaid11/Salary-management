import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { ApiError, createEmployee } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  ApiError: class ApiError extends Error {
    fieldErrors?: Record<string, string[]>;
    constructor(message: string, fieldErrors?: Record<string, string[]>) {
      super(message);
      this.fieldErrors = fieldErrors;
    }
  },
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("EmployeeForm", () => {
  it("shows client validation errors before submit", async () => {
    const user = userEvent.setup();
    renderWithClient(<EmployeeForm mode="create" />);

    await user.click(screen.getByRole("button", { name: /create employee/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
  });

  it("maps API validation errors onto fields", async () => {
    const user = userEvent.setup();
    (createEmployee as jest.Mock).mockRejectedValueOnce(new ApiError("Validation failed", { email: ["has already been taken"] }));

    renderWithClient(<EmployeeForm mode="create" />);

    await user.type(screen.getByLabelText(/full name/i), "Nora Singh");
    await user.type(screen.getByLabelText(/^email$/i), "nora@company.com");
    await user.clear(screen.getByLabelText(/salary/i));
    await user.type(screen.getByLabelText(/salary/i), "100000");
    await user.clear(screen.getByLabelText(/joined at/i));
    await user.type(screen.getByLabelText(/joined at/i), "2024-01-20");

    await user.click(screen.getByRole("button", { name: /create employee/i }));

    await waitFor(() => {
      expect(screen.getByText(/has already been taken/i)).toBeInTheDocument();
    });
  });
});
