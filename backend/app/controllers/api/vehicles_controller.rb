class Api::VehiclesController < ApplicationController
  before_action :require_pm, except: [:index, :show]
  before_action :set_vehicle, only: [:show, :update, :destroy]

  def index
    @vehicles = Vehicle.all
    render json: @vehicles
  end

  def show
    render json: @vehicle
  end

  def create
    @vehicle = Vehicle.new(vehicle_params)

    if @vehicle.save
      render json: @vehicle, status: :created
    else
      render json: { errors: @vehicle.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @vehicle.update(vehicle_params)
      render json: @vehicle
    else
      render json: { errors: @vehicle.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @vehicle.destroy
    head :no_content
  end

  private

  def set_vehicle
    @vehicle = Vehicle.find(params[:id])
  end

  def vehicle_params
    params.require(:vehicle).permit(:name, :license_plate, :status, :vehicle_type)
  end
end
