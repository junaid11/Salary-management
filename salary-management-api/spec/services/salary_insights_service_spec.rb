require "rails_helper"

RSpec.describe SalaryInsightsService do
  describe ".by_country" do
    before do
      create(:employee, country: "USA", salary: 80_000)
      create(:employee, country: "USA", salary: 120_000)
      create(:employee, country: "UK", salary: 90_000)
    end

    it "returns min, max, avg salary grouped by country" do
      results = described_class.by_country
      usa = results.find { |row| row[:country] == "USA" }

      expect(usa[:min_salary]).to eq(80_000.0)
      expect(usa[:max_salary]).to eq(120_000.0)
      expect(usa[:average_salary]).to eq(100_000.0)
      expect(usa[:headcount]).to eq(2)
    end
  end

  describe ".by_title_in_country" do
    it "returns averages by title for a given country" do
      create(:employee, country: "USA", job_title: "Designer", salary: 70_000)
      create(:employee, country: "USA", job_title: "Designer", salary: 90_000)
      create(:employee, country: "Canada", job_title: "Designer", salary: 200_000)

      result = described_class.by_title_in_country("USA")

      expect(result).to contain_exactly(
        a_hash_including(job_title: "Designer", average_salary: 80_000.0, headcount: 2)
      )
    end
  end

  describe ".top_earners" do
    it "returns the five highest-paid employees" do
      create_list(:employee, 6).each_with_index do |employee, index|
        employee.update!(salary: (index + 1) * 10_000)
      end

      salaries = described_class.top_earners.pluck(:salary)

      expect(salaries).to eq([60_000, 50_000, 40_000, 30_000, 20_000])
    end
  end

  describe ".outliers" do
    it "returns employees earning at least 2x their title average" do
      create(:employee, job_title: "QA Engineer", salary: 50_000)
      outlier = create(:employee, job_title: "QA Engineer", salary: 200_000)

      expect(described_class.outliers).to contain_exactly(outlier)
    end
  end

  describe ".department_distribution" do
    it "returns headcount and average salary by department" do
      create(:employee, department: "Engineering", salary: 100_000)
      create(:employee, department: "Engineering", salary: 200_000)

      result = described_class.department_distribution.find { |row| row[:department] == "Engineering" }

      expect(result).to include(average_salary: 150_000.0, headcount: 2)
    end
  end
end
