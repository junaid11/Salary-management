class SalaryInsightsService
  class << self
    def overview
      average_tenure_days = Employee.average(Arel.sql("CURRENT_DATE - joined_at"))&.to_f || 0.0

      {
        total_headcount: Employee.count,
        average_salary: Employee.average(:salary).to_f.round(2),
        average_tenure_years: (average_tenure_days / 365.0).round(2),
        countries_count: Employee.distinct.count(:country),
        departments_count: Employee.distinct.count(:department)
      }
    end

    def by_country
      Employee
        .group(:country)
        .select(
          "country, MIN(salary) AS min_salary, MAX(salary) AS max_salary, " \
          "AVG(salary) AS avg_salary, COUNT(*) AS headcount"
        )
        .order("country ASC")
        .map do |record|
          {
            country: record.country,
            min_salary: record.min_salary.to_f.round(2),
            max_salary: record.max_salary.to_f.round(2),
            average_salary: record.avg_salary.to_f.round(2),
            headcount: record.headcount.to_i
          }
        end
    end

    def by_title_in_country(country)
      Employee.filtered_by_country(country)
              .group(:job_title)
              .select("job_title, AVG(salary) AS avg_salary, COUNT(*) AS headcount")
              .order("job_title ASC")
              .map do |record|
        {
          job_title: record.job_title,
          average_salary: record.avg_salary.to_f.round(2),
          headcount: record.headcount.to_i
        }
      end
    end

    def top_earners(limit = 5)
      Employee.order(salary: :desc, created_at: :asc).limit(limit)
    end

    def outliers
      Employee.joins(<<~SQL.squish)
        INNER JOIN (
          SELECT job_title, SUM(salary) AS total_salary, COUNT(*) AS headcount
          FROM employees
          GROUP BY job_title
        ) title_stats ON title_stats.job_title = employees.job_title
      SQL
              .where("title_stats.headcount > 1")
              .where(
                "employees.salary >= 2 * ((title_stats.total_salary - employees.salary) / NULLIF(title_stats.headcount - 1, 0))"
              )
              .order(salary: :desc)
    end

    def headcount_by_country
      Employee.group(:country)
              .order("country ASC")
              .count
              .map { |country, headcount| { country: country, headcount: headcount } }
    end

    def department_distribution
      Employee.group(:department)
              .select("department, AVG(salary) AS average_salary, COUNT(*) AS headcount")
              .order("department ASC")
              .map do |record|
        {
          department: record.department,
          average_salary: record.average_salary.to_f.round(2),
          headcount: record.headcount.to_i
        }
      end
    end
  end
end
