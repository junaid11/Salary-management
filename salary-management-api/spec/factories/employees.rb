FactoryBot.define do
  factory :employee do
    sequence(:full_name) { |n| "Employee #{n}" }
    job_title { "Software Engineer" }
    country { "USA" }
    salary { 100_000 }
    department { "Engineering" }
    sequence(:email) { |n| "employee#{n}@company.com" }
    employment_type { "full_time" }
    joined_at { 2.years.ago.to_date }
  end
end
