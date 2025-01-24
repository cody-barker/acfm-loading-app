class AddQuantityToEquipmentItems < ActiveRecord::Migration[7.1]
  def change
    add_column :equipment_items, :quantity, :integer
  end
end
