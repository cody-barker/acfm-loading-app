class EquipmentItem < ApplicationRecord
  # Associations
  has_many :loading_list_items
  has_many :loading_lists, through: :loading_list_items
  
  # Validations
  validates :name, presence: true
  validates :category, presence: true
  validates :status, presence: true, inclusion: { in: %w[available in_use maintenance retired] }
  validates :identifier, presence: true, uniqueness: true
  validates :quantity, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  
  # Callbacks
  before_validation :set_defaults
  
  # Scopes
  scope :available, -> { where(status: 'available') }
  scope :by_category, ->(category) { where(category: category) }
  
  # Methods
  def mark_as_in_use
    update(status: 'in_use')
  end
  
  def mark_as_available
    update(status: 'available')
  end
  
  def available_quantity(excluding_loading_list_id: nil)
    return 0 unless status == 'available'
    
    total_quantity = quantity || 0
    reserved_quantity = loading_list_items
      .joins(:loading_list)
      .where.not(loading_lists: { id: excluding_loading_list_id })
      .sum(:quantity)
    
    [total_quantity - reserved_quantity, 0].max
  end

  def as_json(options = {})
    super(options).merge(
      available_quantity: available_quantity(
        excluding_loading_list_id: options[:excluding_loading_list_id]
      )
    )
  end
  
  private
  
  def set_defaults
    self.quantity ||= 0
    self.status ||= 'available'
  end
end
