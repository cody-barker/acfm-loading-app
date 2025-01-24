class Api::TrailersController < ApplicationController
  before_action :require_pm, except: [:index, :show]
  before_action :set_trailer, only: [:show, :update, :destroy]

  def index
    @trailers = Trailer.all
    render json: @trailers
  end

  def show
    render json: @trailer
  end

  def create
    @trailer = Trailer.new(trailer_params)

    if @trailer.save
      render json: @trailer, status: :created
    else
      render json: { errors: @trailer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @trailer.update(trailer_params)
      render json: @trailer
    else
      render json: { errors: @trailer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @trailer.destroy
    head :no_content
  end

  private

  def set_trailer
    @trailer = Trailer.find(params[:id])
  end

  def trailer_params
    params.require(:trailer).permit(:name, :license_plate, :status, :trailer_type)
  end
end
