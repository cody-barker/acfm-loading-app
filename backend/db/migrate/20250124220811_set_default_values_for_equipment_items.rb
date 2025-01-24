class SetDefaultValuesForEquipmentItems < ActiveRecord::Migration[7.1]
  def up
    # Set default quantity to 0 for any null values
    execute <<-SQL
      UPDATE equipment_items 
      SET quantity = 0 
      WHERE quantity IS NULL
    SQL

    # Set default status to 'available' for any null values
    execute <<-SQL
      UPDATE equipment_items 
      SET status = 'available' 
      WHERE status IS NULL
    SQL

    # Add not null constraint to quantity
    change_column_null :equipment_items, :quantity, false, 0
    
    # Add default value for new records
    change_column_default :equipment_items, :quantity, from: nil, to: 0
  end

  def down
    change_column_null :equipment_items, :quantity, true
    change_column_default :equipment_items, :quantity, from: 0, to: nil
  end
end
