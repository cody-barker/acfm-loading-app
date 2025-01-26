import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { api } from "../../utils/api";

const LoadingListDetail = ({ loadingList, onBack, onUpdateList }) => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [warning, setWarning] = useState(null);
  const [localLoadingList, setLocalLoadingList] = useState(loadingList);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    setLocalLoadingList(loadingList);
  }, [loadingList]);

  useEffect(() => {
    fetchEquipmentItems();
  }, []);

  const fetchEquipmentItems = async () => {
    try {
      const data = await api.get("/equipment_items");
      const availableItems = data.filter((item) => item.status === "available");
      setEquipmentItems(availableItems);
    } catch (error) {
      console.error("Error fetching equipment items:", error);
      setWarning("Failed to load equipment items");
    }
  };

  const getAvailableQuantity = (equipmentItem) => {
    if (!equipmentItem || equipmentItem.status !== "available") return 0;
    return equipmentItem.available_quantity;
  };

  const handleAddItem = async (equipmentItem) => {
    const existingItem = localLoadingList.loading_list_items?.find(
      (item) => item.equipment_item_id === equipmentItem.id
    );

    if (existingItem) {
      setWarning(
        "This item is already in the loading list. Use the + button to increase quantity."
      );
      return;
    }

    // Optional: Warn the user but still allow adding
    const availableQuantity = getAvailableQuantity(equipmentItem);
    if (availableQuantity < 1) {
      setWarning(
        `Warning: No available inventory for ${equipmentItem.name}. Added to the list anyway.`
      );
    }

    try {
      const response = await api.post(
        `/loading_lists/${localLoadingList.id}/loading_list_items`,
        {
          loading_list_item: {
            equipment_item_id: equipmentItem.id,
            quantity: 1,
            status: "unloaded",
          },
        }
      );

      if (response && response.id) {
        const updatedList = {
          ...localLoadingList,
          loading_list_items: [
            ...(localLoadingList.loading_list_items || []),
            response,
          ],
        };
        setLocalLoadingList(updatedList);
        onUpdateList();
        fetchEquipmentItems();
      }
    } catch (error) {
      console.error("Error adding item to loading list:", error);
      setWarning("Failed to add item to loading list. Please try again.");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("All"); // Default to show all

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredEquipmentItems = equipmentItems.filter((item) => {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  const handleQuantityChange = async (item, change) => {
    const newQuantity = Math.max(0, parseInt(item.quantity) + change);

    if (newQuantity === 0) {
      handleRemoveItem(item.id);
      return;
    }

    const maxAvailable = getAvailableQuantity(item.equipment_item);
    if (newQuantity > maxAvailable) {
      setWarning(
        `Warning: You are requesting ${newQuantity} ${item.equipment_item.name}(s), but only ${maxAvailable} are available in inventory.`
      );
    }

    try {
      const response = await api.put(
        `/loading_lists/${localLoadingList.id}/loading_list_items/${item.id}`,
        {
          loading_list_item: {
            quantity: newQuantity,
          },
        }
      );

      const updatedList = {
        ...localLoadingList,
        loading_list_items: localLoadingList.loading_list_items.map(
          (listItem) =>
            listItem.id === item.id
              ? { ...listItem, quantity: newQuantity }
              : listItem
        ),
      };
      setLocalLoadingList(updatedList);
      onUpdateList();
      fetchEquipmentItems();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setWarning("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(
        `/loading_lists/${localLoadingList.id}/loading_list_items/${itemId}`
      );
      const updatedList = {
        ...localLoadingList,
        loading_list_items: localLoadingList.loading_list_items.filter(
          (item) => item.id !== itemId
        ),
      };
      setLocalLoadingList(updatedList);
      onUpdateList();
      fetchEquipmentItems();
    } catch (error) {
      console.error("Error removing item:", error);
      setWarning("Failed to remove item");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Exit if there's no valid destination
    if (!destination) return;

    // Exit if dropped in the same location
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Handle dragging from available equipment to loading list
    if (
      source.droppableId === "available-equipment" &&
      destination.droppableId === "loading-list-items"
    ) {
      const equipmentItemId = parseInt(draggableId.split("equipment-")[1]);
      const equipmentItem = equipmentItems.find(
        (item) => item.id === equipmentItemId
      );

      if (!equipmentItem) return;

      // Allow the drag and drop even if the quantity is 0
      if (getAvailableQuantity(equipmentItem) < 1) {
        setWarning(
          `Warning: ${equipmentItem.name} has no available inventory but was added to the list.`
        );
      }

      await handleAddItem(equipmentItem);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {localLoadingList.site_name} -{" "}
            {new Date(localLoadingList.date).toLocaleDateString()}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, height: "80vh" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Available Equipment
              </Typography>
              <Box>
                <FormControl fullWidth>
                  <Select
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Trucks">Trucks</MenuItem>
                    <MenuItem value="Trailers">Trailers</MenuItem>
                    <MenuItem value="Utility Vehicles">
                      Utility Vehicles
                    </MenuItem>
                    <MenuItem value="Hand Tools">Hand Tools</MenuItem>
                    <MenuItem value="Power Tools">Power Tools</MenuItem>
                    <MenuItem value="Spray">Spray</MenuItem>
                    <MenuItem value="Site Keys">Site Keys</MenuItem>
                    <MenuItem value="PPE">PPE</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Droppable
                droppableId="available-equipment"
                isDropDisabled={true}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      height: "calc(100% - 48px)",
                      overflowY: "auto",
                      bgcolor: snapshot.isDraggingOver
                        ? "action.hover"
                        : "transparent",
                      transition: "background-color 0.2s ease",
                      minHeight: "200px",
                      p: 1,
                    }}
                  >
                    {filteredEquipmentItems.map((item, index) => {
                      const availableQty = getAvailableQuantity(item);
                      return (
                        <Draggable
                          key={`equipment-${item.id}`}
                          draggableId={`equipment-${item.id}`}
                          index={index}
                          isDragDisabled={false} // Allow dragging regardless of quantity
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                opacity: availableQty < 1 ? 0.5 : 1,
                              }}
                              onClick={() => {
                                // Handle selection logic
                                const newQuantity =
                                  selectedQuantities[item.id] || 0;
                                const newTotal = newQuantity + 1; // Increment the quantity

                                // Show warning if the new total exceeds available quantity
                                if (newTotal > availableQty) {
                                  alert(
                                    `Warning: You are trying to add ${newTotal} ${item.name}, but only ${availableQty} are available.`
                                  );
                                }

                                // Update the selected quantities, allowing negatives
                                setSelectedQuantities({
                                  ...selectedQuantities,
                                  [item.id]: newTotal,
                                });
                              }}
                            >
                              <CardContent>
                                <Typography variant="body1">
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Available: {availableQty}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper sx={{ p: 2, height: "80vh" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Loading List Items
              </Typography>
              <Droppable droppableId="loading-list-items">
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      height: "calc(100% - 48px)",
                      overflowY: "auto",
                      bgcolor: snapshot.isDraggingOver
                        ? "action.hover"
                        : "transparent",
                      transition: "background-color 0.2s ease",
                      minHeight: "200px",
                      p: 1,
                    }}
                  >
                    {(localLoadingList.loading_list_items || []).map(
                      (item, index) => (
                        <Draggable
                          key={`loading-list-item-${item.id}`}
                          draggableId={`loading-list-item-${item.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                transform: snapshot.isDragging
                                  ? "rotate(3deg)"
                                  : "none",
                                transition: "transform 0.2s ease",
                              }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Typography variant="body1">
                                    {item.equipment_item.name}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleQuantityChange(item, -1)
                                    }
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <Typography>{item.quantity}</Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleQuantityChange(item, 1)
                                    }
                                    disabled={
                                      getAvailableQuantity(
                                        item.equipment_item
                                      ) < 1
                                    }
                                  >
                                    <AddIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveItem(item.id)}
                                    sx={{ ml: "auto" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={!!warning}
          autoHideDuration={6000}
          onClose={() => setWarning(null)}
        >
          <Alert onClose={() => setWarning(null)} severity="warning">
            {warning}
          </Alert>
        </Snackbar>
      </Box>
    </DragDropContext>
  );
};

export default LoadingListDetail;
