class LoadingListItem < ApplicationRecord
  # Associations
  belongs_to :loading_list
  belongs_to :equipment_item
  
  # Validations
  validates :status, presence: true, inclusion: { in: %w[unloaded staged loaded] }
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validate :quantity_within_available_limit
  
  # Callbacks
  after_save :update_equipment_status
  before_destroy :ensure_equipment_available
  
  private
  
  def quantity_within_available_limit
    return unless equipment_item && quantity_changed?
    
    total_allocated = LoadingListItem
      .where(equipment_item_id: equipment_item_id)
      .where.not(id: id) # Exclude current item when updating
      .sum(:quantity)
    
    available = equipment_item.quantity - total_allocated
    
    if quantity > available
      errors.add(:quantity, "exceeds available amount. Only #{available} available")
    end
  end
  
  def update_equipment_status
    # Only update equipment status if all items are loaded
    if status == 'loaded' && all_items_loaded?
      equipment_item.mark_as_in_use
    elsif status == 'unloaded'
      # Check if this was the last loaded item
      equipment_item.mark_as_available if no_other_loaded_items?
    end
  end

  def all_items_loaded?
    equipment_item.loading_list_items.all? { |item| item.status == 'loaded' }
  end

  def no_other_loaded_items?
    !equipment_item.loading_list_items.where(status: 'loaded').where.not(id: id).exists?
  end
  
  def ensure_equipment_available
    equipment_item.mark_as_available if no_other_loaded_items?
  end
end
