require "rails_helper"

RSpec.describe Employee, type: :model do
  subject(:employee) { build(:employee) }

  before do
    create(:employee, email: "existing@company.com")
  end

  it { is_expected.to validate_presence_of(:full_name) }
  it { is_expected.to validate_presence_of(:job_title) }
  it { is_expected.to validate_presence_of(:country) }
  it { is_expected.to validate_presence_of(:department) }
  it { is_expected.to validate_presence_of(:joined_at) }
  it { is_expected.to validate_numericality_of(:salary).is_greater_than(0) }
  it { is_expected.to validate_inclusion_of(:employment_type).in_array(Employee::EMPLOYMENT_TYPES) }
  it { is_expected.to allow_value("valid@company.com").for(:email) }
  it { is_expected.not_to allow_value("bad-email").for(:email) }

  it "validates email uniqueness case-insensitively" do
    duplicate = build(:employee, email: "EXISTING@company.com")

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:email]).to include("has already been taken")
  end

  it "does not allow future joined_at dates" do
    employee.joined_at = Date.current + 1.day

    expect(employee).not_to be_valid
    expect(employee.errors[:joined_at]).to include("can't be in the future")
  end

  describe ".search" do
    it "matches against name, title, and country" do
      engineer = create(:employee, full_name: "Mina Stone", job_title: "QA Engineer", country: "Canada")
      _other = create(:employee, full_name: "Leo Hart", job_title: "Designer", country: "France")

      expect(described_class.search("Mina")).to contain_exactly(engineer)
      expect(described_class.search("QA")).to include(engineer)
      expect(described_class.search("Canada")).to include(engineer)
    end

    it "treats wildcard characters as literal search input" do
      matching_employee = create(:employee, full_name: "Ava 100%")
      create(:employee, full_name: "Ava 100x")

      expect(described_class.search("100%")).to contain_exactly(matching_employee)
    end
  end

  describe ".sorted_by" do
    it "falls back to created_at desc for unsupported columns" do
      create(:employee, created_at: 2.days.ago)
      create(:employee, created_at: 1.day.ago)

      expect(described_class.sorted_by("bogus", "asc")).to eq(described_class.order(created_at: :desc))
      expect(described_class.sorted_by("salary", "asc")).to eq(described_class.order(salary: :asc))
    end
  end
end
