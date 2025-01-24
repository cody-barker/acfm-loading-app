class Api::Pm::DashboardController < ApplicationController
  before_action :require_pm
  
  def index
    render json: {
      active_loading_lists: LoadingList.active.includes(:pm, :loader).order(date: :desc),
      available_equipment: EquipmentItem.available,
      available_vehicles: Vehicle.available,
      available_trailers: Trailer.available,
      loaders: User.loaders
    }
  end
end
