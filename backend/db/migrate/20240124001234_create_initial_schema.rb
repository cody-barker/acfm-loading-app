class CreateInitialSchema < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest
      t.string :role, null: false
      t.timestamps
    end

    create_table :loading_lists do |t|
      t.references :pm, null: false, foreign_key: { to_table: :users }
      t.references :loader, foreign_key: { to_table: :users }
      t.date :date, null: false
      t.string :status, null: false
      t.string :site_name, null: false
      t.text :notes
      t.timestamps
    end

    create_table :equipment_items do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.string :status, null: false
      t.string :identifier, null: false, index: { unique: true }
      t.text :description
      t.timestamps
    end

    create_table :loading_list_items do |t|
      t.references :loading_list, null: false, foreign_key: true
      t.references :equipment_item, null: false, foreign_key: true
      t.string :status, null: false
      t.integer :quantity, null: false
      t.text :notes
      t.timestamps
    end

    create_table :vehicles do |t|
      t.string :identifier, null: false, index: { unique: true }
      t.string :vehicle_type, null: false
      t.string :status, null: false
      t.text :description
      t.timestamps
    end

    create_table :trailers do |t|
      t.string :identifier, null: false, index: { unique: true }
      t.string :trailer_type, null: false
      t.string :status, null: false
      t.text :description
      t.timestamps
    end

    create_table :vehicle_assignments do |t|
      t.references :loading_list, null: false, foreign_key: true, index: { unique: true }
      t.references :vehicle, null: false, foreign_key: true
      t.date :date, null: false
      t.timestamps
    end

    create_table :trailer_assignments do |t|
      t.references :loading_list, null: false, foreign_key: true, index: { unique: true }
      t.references :trailer, null: false, foreign_key: true
      t.date :date, null: false
      t.timestamps
    end
  end
end
