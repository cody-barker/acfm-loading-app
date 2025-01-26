import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { api } from "../../utils/api";
import LoadingListDetail from "./LoadingListDetail";

const LoadingListBoard = ({
  loadingLists,
  onUpdateList,
  teams,
  setTeams,
  pmList,
  setPmList,
}) => {
  const [editList, setEditList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    site_name: "",
    date: "",
    pm_id: "",
    team_id: "",
  });
  const f = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  });
  const handleCreateList = async () => {
    try {
      const response = await api.post("/loading_lists", {
        loading_list: {
          date: today,
          site_name: "New Loading List",
          notes: "",
        },
      });

      await onUpdateList();
      handleSelectList(response.id);
    } catch (error) {
      console.error("Error creating loading list:", error);
    }
  };

  const handleDeleteList = async (event, listId) => {
    event.stopPropagation();
    try {
      await api.delete(`/loading_lists/${listId}`);
      onUpdateList();
    } catch (error) {
      console.error("Error deleting loading list:", error);
    }
  };

  const handleSelectList = async (list) => {
    try {
      const freshData = await api.get(`/loading_lists/${list.id}`);
      setSelectedList(freshData);
    } catch (error) {
      console.error("Error fetching loading list details:", error);
    }
  };

  const handleEditClick = (list) => {
    setEditList(list);
    setEditForm({
      site_name: list.site_name,
      date: list.date,
      pm_id: list.pm_id,
      team_id: list.team? list.team.id : null,
      notes: list.notes,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/loading_lists/${editList.id}`, {
        loading_list: editForm,
      });
      onUpdateList(); // Refresh the loading lists
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating loading list:", error);
    }
  };

  if (selectedList) {
    return (
      <LoadingListDetail
        loadingList={selectedList}
        onBack={() => setSelectedList(null)}
        onUpdateList={async () => {
          onUpdateList();
          // Refresh the selected list data
          try {
            const freshData = await api.get(
              `/loading_lists/${selectedList.id}`
            );
            setSelectedList(freshData);
          } catch (error) {
            console.error("Error refreshing loading list details:", error);
          }
        }}
      />
    );
  }

  // Filter lists based on date comparisons
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  // Ensure list.date is parsed correctly
  const todayLists = loadingLists.filter((list) => {
    const listDate = new Date(`${list.date}T00:00:00`); // console.lpend time to date
    return listDate.toDateString() === today.toDateString();
  });

  const tomorrowLists = loadingLists.filter((list) => {
    const listDate = new Date(`${list.date}T00:00:00`); // Append time to date
    return listDate.toDateString() === tomorrow.toDateString();
  });

  const previousLists = loadingLists.filter((list) => {
    const listDate = new Date(`${list.date}T24:00:00`); // Append time to date
    return listDate < today && listDate >= oneWeekAgo; // Ensure it is strictly less than today
  });

  const getTotalQuantity = (list) => {
    return list.loading_list_items.reduce((total, item) => {
      return total + item.quantity; // Assuming each item has a 'quantity' property
    }, 0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Loading Lists</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateList}
        >
          Create Loading List
        </Button>
      </Box>

      {tomorrowLists.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Tomorrow</Typography>
          <Grid container spacing={2}>
            {tomorrowLists.map((list) => (
              <Grid item xs={12} sm={6} md={4} key={list.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    position: "relative",
                  }}
                  onClick={() => handleSelectList(list)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {list.site_name}
                      </Typography>
                      <Typography variant="h6" noWrap sx={{ mr: 10 }}>
                        {`${list.pm.first_name} ${list.pm.last_name}`}
                      </Typography>
                      <Box></Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(list);
                        }}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 40,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteList(e, list.id)}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 8,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                      {list.team ? list.team.name : "No Team"}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ mb: 2 }}
                      gutterBottom
                    >
                      {list.date}
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      <Chip
                        label={`${getTotalQuantity(list)} items`}
                        size="small"
                        color="primary"
                      />
                      {list.vehicle && (
                        <Chip
                          label={`Vehicle: ${list.vehicle.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {list.trailer && (
                        <Chip
                          label={`Trailer: ${list.trailer.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      <Typography variant="p" noWrap sx={{ mr: 10 }}>
                        {list.notes}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {todayLists.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Today</Typography>
          <Grid container spacing={2}>
            {todayLists.map((list) => (
              <Grid item xs={12} sm={6} md={4} key={list.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    position: "relative",
                  }}
                  onClick={() => handleSelectList(list)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {list.site_name}
                      </Typography>
                      <Typography variant="h6" noWrap sx={{ mr: 10 }}>
                        {`${list.pm.first_name} ${list.pm.last_name}`}
                        <Typography variant="h6" noWrap sx={{ mr: 10 }}>
                          {list.notes}
                        </Typography>
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(list);
                        }}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 40,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteList(e, list.id)}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 8,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                      {list.team ? list.team.name : "No Team"}{" "}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      {list.date}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      <Chip
                        label={`${getTotalQuantity(list)} items`}
                        size="small"
                        color="primary"
                      />
                      {list.vehicle && (
                        <Chip
                          label={`Vehicle: ${list.vehicle.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {list.trailer && (
                        <Chip
                          label={`Trailer: ${list.trailer.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {previousLists.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Previous Lists</Typography>
          <Grid container spacing={2}>
            {previousLists.map((list) => (
              <Grid item xs={12} sm={6} md={4} key={list.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    position: "relative",
                  }}
                  onClick={() => handleSelectList(list)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {list.site_name}
                      </Typography>
                      <Typography variant="h6" noWrap sx={{ mr: 10 }}>
                        {`${list.pm.first_name} ${list.pm.last_name}`}
                      </Typography>
                      <Typography variant="h6" noWrap sx={{ mr: 10 }}>
                        {list.notes}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(list);
                        }}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 40,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteList(e, list.id)}
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 8,
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                      {list.team ? list.team.name : "No Team"}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ mb: 2 }}
                      gutterBottom
                    >
                      {list.date}
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      <Chip
                        label={`${getTotalQuantity(list)} items`}
                        size="small"
                        color="primary"
                      />
                      {list.vehicle && (
                        <Chip
                          label={`Vehicle: ${list.vehicle.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {list.trailer && (
                        <Chip
                          label={`Trailer: ${list.trailer.name}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Loading List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Site Name"
            fullWidth
            variant="outlined"
            value={editForm.site_name}
            onChange={(e) =>
              setEditForm({ ...editForm, site_name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel id="pm-label">PM</InputLabel>
            <Select
              labelId="pm-label"
              label="PM"
              value={editForm.pm_id || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, pm_id: e.target.value })
              }
            >
              {pmList.map((pm) => (
                <MenuItem key={pm.id} value={pm.id}>
                  {pm.first_name} {pm.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="team-label">Team</InputLabel>
            <Select
              labelId="team-label"
              label="Team"
              value={editForm.team_id || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, team_id: e.target.value })
              }
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            variant="outlined"
            value={editForm.notes}
            onChange={(e) =>
              setEditForm({ ...editForm, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoadingListBoard;
