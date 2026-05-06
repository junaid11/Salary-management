module Api
  module V1
    class EmployeesController < ApplicationController
      DEFAULT_PER_PAGE = 50
      MAX_PER_PAGE = 100

      def index
        employees = Employee.search(params[:search])
                            .filtered_by_country(params[:country])
                            .filtered_by_job_title(params[:job_title])
                            .sorted_by(params[:sort], params[:direction])

        total_count = employees.count
        paginated = employees.offset((page_number - 1) * per_page).limit(per_page)

        render_success(data: EmployeeSerializer.collection(paginated), meta: pagination_meta(total_count))
      end

      def show
        render_success(data: EmployeeSerializer.new(employee).as_json)
      end

      def create
        created_employee = Employee.new(employee_params)
        created_employee.save!
        render_success(data: EmployeeSerializer.new(created_employee).as_json, status: :created)
      end

      def update
        employee.update!(employee_params)
        render_success(data: EmployeeSerializer.new(employee).as_json)
      end

      def destroy
        employee.destroy!
        head :no_content
      end

      private

      def employee
        @employee ||= Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :full_name,
          :job_title,
          :country,
          :salary,
          :department,
          :email,
          :employment_type,
          :joined_at
        )
      end

      def page_number
        [params.fetch(:page, 1).to_i, 1].max
      end

      def per_page
        requested = params.fetch(:per, DEFAULT_PER_PAGE).to_i
        requested = DEFAULT_PER_PAGE if requested <= 0
        [requested, MAX_PER_PAGE].min
      end

      def pagination_meta(total_count)
        total_pages = (total_count.to_f / per_page).ceil

        {
          current_page: page_number,
          next_page: page_number < total_pages ? page_number + 1 : nil,
          prev_page: page_number > 1 ? page_number - 1 : nil,
          total_pages: total_pages,
          total_count: total_count,
          per_page: per_page
        }
      end
    end
  end
end
