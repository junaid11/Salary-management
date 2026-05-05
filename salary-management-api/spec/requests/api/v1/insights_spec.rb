require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    create(:employee, country: "USA", job_title: "Software Engineer", salary: 80_000, department: "Engineering")
    create(:employee, country: "USA", job_title: "Software Engineer", salary: 220_000, department: "Engineering")
    create(:employee, country: "Canada", job_title: "Designer", salary: 90_000, department: "Design")
  end

  it "returns salary by country" do
    get "/api/v1/insights/salary_by_country"

    expect(response).to have_http_status(:ok)
    usa = response.parsed_body["data"].find { |row| row["country"] == "USA" }

    expect(usa["min_salary"]).to eq(80000.0)
    expect(usa["max_salary"]).to eq(220000.0)
    expect(usa["average_salary"]).to eq(150000.0)
    expect(usa["headcount"]).to eq(2)
  end

  it "returns salary by title within a country" do
    get "/api/v1/insights/salary_by_title", params: { country: "USA" }

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"]).to include(
      a_hash_including("job_title" => "Software Engineer", "average_salary" => 150000.0, "headcount" => 2)
    )
  end

  it "returns top earners" do
    get "/api/v1/insights/top_earners"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"].first["salary"]).to eq(220000.0)
  end

  it "returns outliers" do
    get "/api/v1/insights/outliers"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"].first["salary"]).to eq(220000.0)
  end

  it "returns headcount by country" do
    get "/api/v1/insights/headcount_by_country"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"]).to include(
      a_hash_including("country" => "Canada", "headcount" => 1),
      a_hash_including("country" => "USA", "headcount" => 2)
    )
  end

  it "returns department distribution" do
    get "/api/v1/insights/department_distribution"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"]).to include(
      a_hash_including("department" => "Engineering", "average_salary" => 150000.0, "headcount" => 2)
    )
  end

  it "returns overview metrics" do
    get "/api/v1/insights/overview"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"]["total_headcount"]).to eq(3)
    expect(response.parsed_body["data"]["countries_count"]).to eq(2)
  end
end
