class Api::SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create, :auto_login]

  def create
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = generate_token(user)
      session[:user_id] = user.id
      render json: { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def auto_login
    token = request.headers['Authorization']&.split(' ')&.last
    if token && (user = User.find_by(id: decode_token(token)))
      session[:user_id] = user.id
      render json: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid or expired token' }, status: :unauthorized
    end
  end

  def destroy
    session[:user_id] = nil
    render json: { message: 'Logged out successfully' }, status: :ok
  end

  private

  def generate_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  def decode_token(token)
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      decoded['user_id']
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
end
