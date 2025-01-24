class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  before_action :authenticate_user
  
  private
  
  def authenticate_user
    unless current_user
      render json: { error: 'Not authorized' }, status: :unauthorized
    end
  end
  
  def current_user
    return @current_user if @current_user
    
    if session[:user_id]
      @current_user = User.find_by(id: session[:user_id])
    elsif auth_header
      token = auth_header.split(' ').last
      user_id = decode_token(token)
      @current_user = User.find_by(id: user_id) if user_id
    end
    
    @current_user
  end
  
  def auth_header
    request.headers['Authorization']
  end
  
  def decode_token(token)
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      decoded['user_id']
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
  
  def require_pm
    unless current_user&.role == 'pm'
      render json: { error: 'Not authorized as PM' }, status: :forbidden
    end
  end
  
  def require_loader
    unless current_user&.role == 'loader'
      render json: { error: 'Not authorized as Loader' }, status: :forbidden
    end
  end
end
