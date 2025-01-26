# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_01_26_191349) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "equipment_items", force: :cascade do |t|
    t.string "name", null: false
    t.string "category", null: false
    t.string "status", null: false
    t.string "identifier", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "quantity", default: 0, null: false
    t.index ["identifier"], name: "index_equipment_items_on_identifier", unique: true
  end

  create_table "loading_list_items", force: :cascade do |t|
    t.bigint "loading_list_id", null: false
    t.bigint "equipment_item_id", null: false
    t.string "status", null: false
    t.integer "quantity", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["equipment_item_id"], name: "index_loading_list_items_on_equipment_item_id"
    t.index ["loading_list_id"], name: "index_loading_list_items_on_loading_list_id"
  end

  create_table "loading_lists", force: :cascade do |t|
    t.bigint "pm_id", null: false
    t.bigint "loader_id"
    t.date "date", null: false
    t.string "status", null: false
    t.string "site_name", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "team_id"
    t.date "return_date"
    t.index ["loader_id"], name: "index_loading_lists_on_loader_id"
    t.index ["pm_id"], name: "index_loading_lists_on_pm_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "trailer_assignments", force: :cascade do |t|
    t.bigint "loading_list_id", null: false
    t.bigint "trailer_id", null: false
    t.date "date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["loading_list_id"], name: "index_trailer_assignments_on_loading_list_id", unique: true
    t.index ["trailer_id"], name: "index_trailer_assignments_on_trailer_id"
  end

  create_table "trailers", force: :cascade do |t|
    t.string "identifier", null: false
    t.string "trailer_type", null: false
    t.string "status", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["identifier"], name: "index_trailers_on_identifier", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.string "role", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "vehicle_assignments", force: :cascade do |t|
    t.bigint "loading_list_id", null: false
    t.bigint "vehicle_id", null: false
    t.date "date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["loading_list_id"], name: "index_vehicle_assignments_on_loading_list_id", unique: true
    t.index ["vehicle_id"], name: "index_vehicle_assignments_on_vehicle_id"
  end

  create_table "vehicles", force: :cascade do |t|
    t.string "identifier", null: false
    t.string "vehicle_type", null: false
    t.string "status", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["identifier"], name: "index_vehicles_on_identifier", unique: true
  end

  add_foreign_key "loading_list_items", "equipment_items"
  add_foreign_key "loading_list_items", "loading_lists"
  add_foreign_key "loading_lists", "users", column: "loader_id"
  add_foreign_key "loading_lists", "users", column: "pm_id"
  add_foreign_key "trailer_assignments", "loading_lists"
  add_foreign_key "trailer_assignments", "trailers"
  add_foreign_key "vehicle_assignments", "loading_lists"
  add_foreign_key "vehicle_assignments", "vehicles"
end
