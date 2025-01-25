class AddTeamIdForeignKeyToLoadingListsTable < ActiveRecord::Migration[7.1]
  def change
    add_column :loading_lists, :team_id, :bigint
  end
end
