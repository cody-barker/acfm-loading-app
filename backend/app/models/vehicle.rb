class Vehicle < ApplicationRecord
  # Associations
  has_many :vehicle_assignments
  has_many :loading_lists, through: :vehicle_assignments
  
  # Validations
  validates :identifier, presence: true, uniqueness: true
  validates :vehicle_type, presence: true
  validates :status, presence: true, inclusion: { in: %w[available in_use maintenance retired] }
  
  # Scopes
  scope :available, -> { where(status: 'available') }
  scope :by_type, ->(type) { where(vehicle_type: type) }
  
  # Methods
  def mark_as_in_use
    update(status: 'in_use')
  end
  
  def mark_as_available
    update(status: 'available')
  end
end
