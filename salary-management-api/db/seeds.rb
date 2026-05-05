BATCH_SIZE = 500
TOTAL_EMPLOYEES = ENV.fetch("SEED_EMPLOYEE_COUNT", "10000").to_i

first_names = Rails.root.join("db/seed_data/first_names.txt").readlines(chomp: true)
last_names = Rails.root.join("db/seed_data/last_names.txt").readlines(chomp: true)

COUNTRIES = ["USA", "UK", "Canada", "Germany", "India", "Australia", "France"].freeze
JOB_TITLES = [
  "Software Engineer",
  "Product Manager",
  "Designer",
  "Data Analyst",
  "DevOps Engineer",
  "QA Engineer",
  "HR Specialist",
  "Finance Manager"
].freeze
DEPARTMENTS = ["Engineering", "Product", "Design", "Data", "Operations", "HR", "Finance"].freeze
EMPLOYMENT_TYPES = Employee::EMPLOYMENT_TYPES.freeze

puts "Seeding #{TOTAL_EMPLOYEES} employees..."
started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)

Employee.delete_all

employees = TOTAL_EMPLOYEES.times.map do |index|
  first_name = first_names.sample
  last_name = last_names.sample
  slug = "#{first_name}.#{last_name}.#{index}".downcase.gsub(/[^a-z0-9.]/, "")
  current_time = Time.current

  {
    full_name: "#{first_name} #{last_name}",
    job_title: JOB_TITLES.sample,
    country: COUNTRIES.sample,
    department: DEPARTMENTS.sample,
    salary: rand(30_000..250_000).to_f,
    email: "#{slug}@company.com",
    employment_type: EMPLOYMENT_TYPES.sample,
    joined_at: rand(1..3650).days.ago.to_date,
    created_at: current_time,
    updated_at: current_time
  }
end

employees.each_slice(BATCH_SIZE) do |batch|
  Employee.insert_all(batch)
end

duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at
puts "Seeded #{Employee.count} employees in #{duration.round(2)} seconds"
