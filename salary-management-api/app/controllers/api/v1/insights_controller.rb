module Api
  module V1
    class InsightsController < ApplicationController
      def overview
        render_success(data: SalaryInsightsService.overview)
      end

      def salary_by_country
        render_success(data: SalaryInsightsService.by_country)
      end

      def salary_by_title
        render_success(data: SalaryInsightsService.by_title_in_country(params[:country]))
      end

      def top_earners
        render_success(data: EmployeeSerializer.collection(SalaryInsightsService.top_earners))
      end

      def outliers
        render_success(data: EmployeeSerializer.collection(SalaryInsightsService.outliers))
      end

      def headcount_by_country
        render_success(data: SalaryInsightsService.headcount_by_country)
      end

      def department_distribution
        render_success(data: SalaryInsightsService.department_distribution)
      end
    end
  end
end
