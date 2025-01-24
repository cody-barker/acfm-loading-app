class Trailer < ApplicationRecord
  # Associations
  has_many :trailer_assignments
  has_many :loading_lists, through: :trailer_assignments
  
  # Validations
  validates :identifier, presence: true, uniqueness: true
  validates :trailer_type, presence: true
  validates :status, presence: true, inclusion: { in: %w[available in_use maintenance retired] }
  
  # Scopes
  scope :available, -> { where(status: 'available') }
  scope :by_type, ->(type) { where(trailer_type: type) }
  
  # Methods
  def mark_as_in_use
    update(status: 'in_use')
  end
  
  def mark_as_available
    update(status: 'available')
  end
end
