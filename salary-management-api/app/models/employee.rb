class Employee < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze
  SORTABLE_COLUMNS = %w[full_name job_title country department salary joined_at created_at].freeze

  before_validation :normalize_email

  validates :full_name, presence: true
  validates :job_title, presence: true
  validates :country, presence: true
  validates :department, presence: true
  validates :salary, presence: true, numericality: { greater_than: 0 }
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :employment_type, presence: true, inclusion: { in: EMPLOYMENT_TYPES }
  validates :joined_at, presence: true
  validate :joined_at_cannot_be_in_the_future

  scope :filtered_by_country, ->(country) { country.present? ? where(country: country) : all }
  scope :filtered_by_job_title, ->(job_title) { job_title.present? ? where(job_title: job_title) : all }
  scope :search, lambda { |term|
    next all if term.blank?

    sanitized = "%#{sanitize_sql_like(term.strip)}%"
    where(
      "full_name ILIKE :term OR job_title ILIKE :term OR country ILIKE :term",
      term: sanitized
    )
  }
  scope :sorted_by, lambda { |column, direction|
    selected_column = SORTABLE_COLUMNS.include?(column) ? column : "created_at"
    selected_direction = if selected_column == "created_at" && column != "created_at"
                           "desc"
                         elsif %w[asc desc].include?(direction)
                           direction
                         else
                           "desc"
                         end

    order(selected_column => selected_direction)
  }

  private

  def normalize_email
    self.email = email.to_s.strip.downcase.presence
  end

  def joined_at_cannot_be_in_the_future
    return if joined_at.blank? || joined_at <= Date.current

    errors.add(:joined_at, "can't be in the future")
  end
end
