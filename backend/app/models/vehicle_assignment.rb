class VehicleAssignment < ApplicationRecord
  # Associations
  belongs_to :loading_list
  belongs_to :vehicle
  
  # Validations
  validates :loading_list_id, uniqueness: true
  validates :date, presence: true
  
  # Scopes
  scope :for_date, ->(date) { where(date: date) }
  scope :active, -> { joins(:loading_list).where.not(loading_lists: { status: 'completed' }) }
end
