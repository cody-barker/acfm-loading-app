Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/auto_login', to: 'sessions#auto_login'
    get '/pms', to: 'users#pms'
    get '/todays_lists', to: 'loading_lists#todays_lists'

    resources :teams, only: [:index, :show, :create, :update, :destroy]
    resources :equipment_items, only: [:index, :show, :create, :update, :destroy]
    resources :vehicles, only: [:index, :show, :create, :update, :destroy]
    resources :trailers, only: [:index, :show, :create, :update, :destroy]
    
    resources :loading_lists do
      resources :loading_list_items, only: [:create, :update, :destroy]
      resources :vehicle_assignments, only: [:create, :update, :destroy]
      resources :trailer_assignments, only: [:create, :update, :destroy]
    end

    namespace :pm do
      resources :dashboard, only: [:index]
    end
  end
end
