class LoadingList < ApplicationRecord
  # Associations
  belongs_to :pm, class_name: 'User'
  belongs_to :loader, class_name: 'User', optional: true
  belongs_to :team, optional: true
  
  has_many :loading_list_items, dependent: :destroy
  has_many :equipment_items, through: :loading_list_items
  has_one :vehicle_assignment
  has_one :trailer_assignment
  
  # Validations
  validates :date, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending draft in_progress completed] }
  validates :site_name, presence: true
  
  # Scopes
  scope :active, -> { where(status: %w[pending draft in_progress]) }
  scope :for_date, ->(date) { where(date: date) }
  
  # Callbacks
  before_validation :set_default_status
  
  private
  
  def set_default_status
    self.status ||= 'pending'
  end
end
