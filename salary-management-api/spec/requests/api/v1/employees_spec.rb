require "rails_helper"

RSpec.describe "Api::V1::Employees", type: :request do
  describe "GET /api/v1/employees" do
    before do
      create(:employee, full_name: "Alice Product", country: "USA", job_title: "Product Manager", salary: 140_000)
      create(:employee, full_name: "Bob Engineer", country: "India", job_title: "Software Engineer", salary: 110_000)
    end

    it "returns paginated employees filtered by search and sorted by salary" do
      get "/api/v1/employees", params: { search: "Engineer", sort: "salary", direction: "asc", per: 1, page: 1 }

      expect(response).to have_http_status(:ok)

      body = response.parsed_body
      expect(body["data"].length).to eq(1)
      expect(body["data"].first["full_name"]).to eq("Bob Engineer")
      expect(body["meta"]["total_count"]).to eq(1)
      expect(body["meta"]["per_page"]).to eq(1)
    end
  end

  describe "GET /api/v1/employees/:id" do
    it "returns the requested employee" do
      employee = create(:employee)

      get "/api/v1/employees/#{employee.id}"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.dig("data", "id")).to eq(employee.id)
    end
  end

  describe "POST /api/v1/employees" do
    let(:params) do
      {
        employee: {
          full_name: "Nora Singh",
          job_title: "Data Analyst",
          country: "India",
          salary: 95_000,
          department: "Data",
          email: "nora.singh@company.com",
          employment_type: "full_time",
          joined_at: 1.year.ago.to_date
        }
      }
    end

    it "creates an employee" do
      expect do
        post "/api/v1/employees", params: params
      end.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body.dig("data", "full_name")).to eq("Nora Singh")
    end

    it "returns validation errors for invalid payloads" do
      post "/api/v1/employees", params: { employee: params[:employee].merge(email: "bad-email", salary: 0) }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body["error"]).to eq("Validation failed")
      expect(response.parsed_body["errors"].keys).to include("email", "salary")
    end
  end

  describe "PATCH /api/v1/employees/:id" do
    it "updates an employee" do
      employee = create(:employee, full_name: "Before Name")

      patch "/api/v1/employees/#{employee.id}", params: { employee: { full_name: "After Name" } }

      expect(response).to have_http_status(:ok)
      expect(employee.reload.full_name).to eq("After Name")
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    it "deletes the employee" do
      employee = create(:employee)

      expect do
        delete "/api/v1/employees/#{employee.id}"
      end.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe "error responses" do
    it "returns a consistent payload for missing records" do
      get "/api/v1/employees/0"

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body).to include("error")
    end

    it "returns a consistent payload for missing parameters" do
      post "/api/v1/employees", params: {}

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to include("error")
    end
  end
end
