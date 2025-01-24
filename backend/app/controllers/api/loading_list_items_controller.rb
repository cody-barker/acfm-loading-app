module Api
  class LoadingListItemsController < ApplicationController
    before_action :require_pm
    before_action :set_loading_list
    before_action :set_loading_list_item, only: [:update, :destroy]

    def create
      @loading_list_item = @loading_list.loading_list_items.build(loading_list_item_params)
      
      if @loading_list_item.save
        render json: @loading_list_item, status: :created, include: [:equipment_item]
      else
        render json: { errors: @loading_list_item.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @loading_list_item.update(loading_list_item_params)
        render json: @loading_list_item, include: [:equipment_item]
      else
        render json: { errors: @loading_list_item.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @loading_list_item.destroy
      head :no_content
    end

    private

    def set_loading_list
      @loading_list = LoadingList.find(params[:loading_list_id])
    end

    def set_loading_list_item
      @loading_list_item = @loading_list.loading_list_items.find(params[:id])
    end

    def loading_list_item_params
      params.require(:loading_list_item).permit(:equipment_item_id, :quantity, :status)
    end
  end
end
