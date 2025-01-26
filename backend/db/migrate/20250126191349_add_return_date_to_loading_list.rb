class AddReturnDateToLoadingList < ActiveRecord::Migration[7.1]
  def change
    add_column :loading_lists, :return_date, :date
  end
end
