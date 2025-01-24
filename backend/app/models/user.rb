class User < ApplicationRecord
  has_secure_password
  
  # Associations
  has_many :loading_lists, foreign_key: 'pm_id'
  has_many :assigned_lists, class_name: 'LoadingList', foreign_key: 'loader_id'
  
  # Validations
  validates :email, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: %w[pm loader] }
  validates :name, presence: true
  
  # Scopes
  scope :pms, -> { where(role: 'pm') }
  scope :loaders, -> { where(role: 'loader') }
end
