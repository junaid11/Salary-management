class EmployeeSerializer
  def self.collection(records)
    records.map { |record| new(record).as_json }
  end

  def initialize(employee)
    @employee = employee
  end

  def as_json
    {
      id: employee.id,
      full_name: employee.full_name,
      job_title: employee.job_title,
      country: employee.country,
      salary: employee.salary.to_f,
      department: employee.department,
      email: employee.email,
      employment_type: employee.employment_type,
      joined_at: employee.joined_at.iso8601,
      created_at: employee.created_at&.iso8601,
      updated_at: employee.updated_at&.iso8601
    }
  end

  private

  attr_reader :employee
end
