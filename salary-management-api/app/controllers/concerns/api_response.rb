module ApiResponse
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound do |error|
      render_error(message: error.message, status: :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |error|
      render_validation_errors(error.record)
    end

    rescue_from ActionController::ParameterMissing do |error|
      render_error(message: error.message, status: :bad_request)
    end
  end

  private

  def render_success(data:, status: :ok, meta: nil)
    payload = { data: data }
    payload[:meta] = meta if meta.present?

    render json: payload, status: status
  end

  def render_error(message:, status:, errors: nil)
    payload = { error: message }
    payload[:errors] = errors if errors.present?

    render json: payload, status: status
  end

  def render_validation_errors(resource)
    render_error(
      message: "Validation failed",
      status: :unprocessable_entity,
      errors: resource.errors.to_hash(true)
    )
  end
end
