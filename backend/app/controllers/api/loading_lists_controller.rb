class Api::LoadingListsController < ApplicationController
  before_action :require_pm, except: [:show, :update]
  before_action :set_loading_list, only: [:show, :update, :destroy]
  
  def index
    @loading_lists = LoadingList.includes(
      :pm,
      :loader,
      :team,
      { loading_list_items: :equipment_item },
      :equipment_items,
      :vehicle_assignment,
      :trailer_assignment
    ).order(date: :desc)
     .where(pm: current_user)
    
    render json: @loading_lists, include: [
      { loading_list_items: { include: :equipment_item } },
      :pm,
      :team,
      :equipment_items,
      :vehicle_assignment,
      :trailer_assignment
    ]
  end
  
  def show
    render json: @loading_list, include: [
      { loading_list_items: { include: :equipment_item } },
      :equipment_items,
      :vehicle_assignment,
      :trailer_assignment,
      :team,
      :pm # Include the PM association
    ], equipment_serializer_options: { excluding_loading_list_id: @loading_list.id }
  end
  
  def create
    @loading_list = LoadingList.new(loading_list_params)
    @loading_list.pm = current_user
    @loading_list.status = 'pending' unless loading_list_params[:status]
    
    if @loading_list.save
      render json: @loading_list, status: :created, include: [
        { loading_list_items: { include: :equipment_item } },
        :equipment_items,
        :vehicle_assignment,
        :team,
        :pm,
        :trailer_assignment
      ], equipment_serializer_options: { excluding_loading_list_id: @loading_list.id }
    else
      render json: { errors: @loading_list.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    if @loading_list.update(loading_list_params)
      render json: @loading_list, include: [
        { loading_list_items: { include: :equipment_item } },
        :equipment_items,
        :vehicle_assignment,
        :trailer_assignment,
        :team
      ], equipment_serializer_options: { excluding_loading_list_id: @loading_list.id }
    else
      render json: { errors: @loading_list.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def destroy
    @loading_list.destroy
    head :no_content
  end
  
  private
  
  def set_loading_list
    @loading_list = LoadingList.includes(loading_list_items: :equipment_item).find(params[:id])
  end
  
  def loading_list_params
    params.require(:loading_list).permit(
      :date,
      :site_name,
      :team_id,
      :notes,
      :status,
      :loader_id,
      loading_list_items_attributes: [:id, :equipment_item_id, :quantity, :status, :_destroy]
    )
  end
end
