# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create PM user
pm = User.create!(
  name: 'Project Manager',
  email: 'pm@example.com',
  password: 'password123',
  role: 'pm'
)

# Create Loader user
loader = User.create!(
  name: 'Loader',
  email: 'loader@example.com',
  password: 'password123',
  role: 'loader'
)

puts "Created users:"
puts "PM - Email: pm@example.com, Password: password123"
puts "Loader - Email: loader@example.com, Password: password123"

# Create Equipment Items
equipment_categories = ['Tools', 'Safety Equipment', 'Power Tools', 'Machinery']
equipment_items = [
  { name: 'Hammer', category: 'Tools', description: 'Standard claw hammer', quantity: 10 },
  { name: 'Safety Glasses', category: 'Safety Equipment', description: 'Clear safety glasses', quantity: 20 },
  { name: 'Power Drill', category: 'Power Tools', description: '18V cordless drill', quantity: 5 },
  { name: 'Ladder', category: 'Tools', description: '8ft aluminum ladder', quantity: 3 },
  { name: 'Hard Hat', category: 'Safety Equipment', description: 'Type II hard hat', quantity: 15 },
  { name: 'Circular Saw', category: 'Power Tools', description: '7-1/4" circular saw', quantity: 4 },
  { name: 'Generator', category: 'Machinery', description: '5000W portable generator', quantity: 2 },
  { name: 'Work Gloves', category: 'Safety Equipment', description: 'Leather work gloves', quantity: 25 }
]

equipment_items.each do |item|
  EquipmentItem.create!(
    name: item[:name],
    category: item[:category],
    description: item[:description],
    status: 'available',
    quantity: item[:quantity],
    identifier: "#{item[:category]}-#{SecureRandom.hex(4)}".downcase
  )
end

puts "Created #{EquipmentItem.count} equipment items"

# Create Vehicles
vehicles = [
  { identifier: 'F150-001', vehicle_type: 'Pickup', description: 'Ford F-150 Crew Cab' },
  { identifier: 'SILV-001', vehicle_type: 'Pickup', description: 'Chevy Silverado Extended Cab' },
  { identifier: 'TRAN-001', vehicle_type: 'Van', description: 'Ford Transit Cargo Van' }
]

vehicles.each do |vehicle|
  Vehicle.create!(
    identifier: vehicle[:identifier],
    vehicle_type: vehicle[:vehicle_type],
    description: vehicle[:description],
    status: 'available'
  )
end

puts "Created #{Vehicle.count} vehicles"

# Create Trailers
trailers = [
  { identifier: 'UTIL-001', trailer_type: 'Utility', description: '6x12 Utility Trailer' },
  { identifier: 'EQUIP-001', trailer_type: 'Equipment', description: '7x16 Equipment Trailer' },
  { identifier: 'FLAT-001', trailer_type: 'Flatbed', description: '8.5x20 Flatbed Trailer' }
]

trailers.each do |trailer|
  Trailer.create!(
    identifier: trailer[:identifier],
    trailer_type: trailer[:trailer_type],
    description: trailer[:description],
    status: 'available'
  )
end

puts "Created #{Trailer.count} trailers"
