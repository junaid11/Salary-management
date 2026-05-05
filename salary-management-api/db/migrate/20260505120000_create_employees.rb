class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.decimal :salary, null: false, precision: 12, scale: 2
      t.string :department, null: false
      t.string :email, null: false
      t.string :employment_type, null: false
      t.date :joined_at, null: false

      t.timestamps
    end

    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, [:country, :job_title]
    add_index :employees, :email, unique: true
  end
end
