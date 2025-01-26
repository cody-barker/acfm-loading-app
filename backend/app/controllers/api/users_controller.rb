class Api::UsersController < ApplicationController
  def pms
    @pms = User.where(role: 'pm')
    render json: @pms
  end
end
