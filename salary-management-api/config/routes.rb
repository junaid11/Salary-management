Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :employees

      namespace :insights do
        get :overview
        get :salary_by_country
        get :salary_by_title
        get :top_earners
        get :outliers
        get :headcount_by_country
        get :department_distribution
      end
    end
  end
end
