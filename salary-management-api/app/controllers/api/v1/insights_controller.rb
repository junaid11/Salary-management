module Api
  module V1
    class InsightsController < ApplicationController
      def overview
        render json: { data: SalaryInsightsService.overview }
      end

      def salary_by_country
        render json: { data: SalaryInsightsService.by_country }
      end

      def salary_by_title
        render json: { data: SalaryInsightsService.by_title_in_country(params[:country]) }
      end

      def top_earners
        render json: { data: SalaryInsightsService.top_earners.map { |employee| EmployeeSerializer.new(employee).as_json } }
      end

      def outliers
        render json: { data: SalaryInsightsService.outliers.map { |employee| EmployeeSerializer.new(employee).as_json } }
      end

      def headcount_by_country
        render json: { data: SalaryInsightsService.headcount_by_country }
      end

      def department_distribution
        render json: { data: SalaryInsightsService.department_distribution }
      end
    end
  end
end
