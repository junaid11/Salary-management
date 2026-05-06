class SalaryInsightsService
  class << self
    def overview
      joined_dates = Employee.where.not(joined_at: nil).pluck(:joined_at)
      total_tenure_days = joined_dates.sum { |joined_at| (Date.current - joined_at).to_i }
      average_tenure_days = joined_dates.any? ? total_tenure_days.to_f / joined_dates.size : 0.0

      {
        total_headcount: Employee.count,
        average_salary: Employee.average(:salary).to_f.round(2),
        average_tenure_years: (average_tenure_days / 365.0).round(2),
        countries_count: Employee.distinct.count(:country),
        departments_count: Employee.distinct.count(:department)
      }
    end

    def by_country
      minimums = Employee.group(:country).minimum(:salary)
      maximums = Employee.group(:country).maximum(:salary)
      averages = Employee.group(:country).average(:salary)
      headcounts = Employee.group(:country).count

      headcounts.keys.sort.map do |country|
        {
          country: country,
          min_salary: minimums.fetch(country).to_f.round(2),
          max_salary: maximums.fetch(country).to_f.round(2),
          average_salary: averages.fetch(country).to_f.round(2),
          headcount: headcounts.fetch(country).to_i
        }
      end
    end

    def by_title_in_country(country)
      scoped_employees = Employee.filtered_by_country(country)
      averages = scoped_employees.group(:job_title).average(:salary)
      headcounts = scoped_employees.group(:job_title).count

      headcounts.keys.sort.map do |job_title|
        {
          job_title: job_title,
          average_salary: averages.fetch(job_title).to_f.round(2),
          headcount: headcounts.fetch(job_title).to_i
        }
      end
    end

    def top_earners(limit = 5)
      Employee.order(salary: :desc, created_at: :asc).limit(limit)
    end

    def outliers
      headcounts = Employee.group(:job_title).count
      total_salaries = Employee.group(:job_title).sum(:salary)
      thresholds = headcounts.each_with_object({}) do |(job_title, headcount), values|
        next if headcount <= 1

        values[job_title] = (2.0 * total_salaries.fetch(job_title).to_f) / (headcount + 1)
      end

      return Employee.none if thresholds.empty?

      employees = Employee.arel_table
      condition = thresholds.reduce(nil) do |node, (job_title, threshold)|
        title_condition = employees[:job_title].eq(job_title).and(employees[:salary].gteq(threshold))
        node ? node.or(title_condition) : title_condition
      end

      Employee.where(condition).order(salary: :desc, created_at: :asc)
    end

    def headcount_by_country
      Employee.group(:country)
              .count
              .sort_by { |country, _headcount| country }
              .map { |country, headcount| { country: country, headcount: headcount } }
    end

    def department_distribution
      averages = Employee.group(:department).average(:salary)
      headcounts = Employee.group(:department).count

      headcounts.keys.sort.map do |department|
        {
          department: department,
          average_salary: averages.fetch(department).to_f.round(2),
          headcount: headcounts.fetch(department).to_i
        }
      end
    end
  end
end
