class Api::EquipmentItemsController < ApplicationController
  before_action :require_pm, except: [:index, :show]
  before_action :set_equipment_item, only: [:show, :update, :destroy]

  def index
    @equipment_items = EquipmentItem.all
    render json: @equipment_items.map { |item| 
      item.as_json.merge(
        quantity: item.quantity || 0,
        status: item.status || 'unavailable'
      )
    }
  end

  def show
    render json: @equipment_item.as_json.merge(
      quantity: @equipment_item.quantity || 0,
      status: @equipment_item.status || 'unavailable'
    )
  end

  def create
    @equipment_item = EquipmentItem.new(equipment_item_params)
    @equipment_item.quantity ||= 0
    @equipment_item.status ||= 'available'

    if @equipment_item.save
      render json: @equipment_item, status: :created
    else
      render json: { errors: @equipment_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @equipment_item.update(equipment_item_params)
      render json: @equipment_item
    else
      render json: { errors: @equipment_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @equipment_item.destroy
    head :no_content
  end

  private

  def set_equipment_item
    @equipment_item = EquipmentItem.find(params[:id])
  end

  def equipment_item_params
    params.require(:equipment_item).permit(:name, :description, :category, :status, :identifier, :quantity)
  end
end
