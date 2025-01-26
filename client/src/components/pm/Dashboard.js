import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Select,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import LoadingListBoard from "./LoadingListBoard";

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function PMDashboard() {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openNewList, setOpenNewList] = useState(false);
  const [loadingLists, setLoadingLists] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [siteName, setSiteName] = useState("");
  const [notes, setNotes] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [pmList, setPmList] = useState([]);

  useEffect(() => {
    fetchLoadingLists();
    fetchEquipmentItems();
    fetchTeams();
    fetchPMs();
  }, []);

  console.log(user);

  const fetchLoadingLists = async () => {
    try {
      const data = await api.get("/loading_lists");
      setLoadingLists(data);
    } catch (error) {
      console.error("Error fetching loading lists:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await api.get("/teams");
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchPMs = async () => {
    try {
      const data = await api.get("/pms");
      setPmList(data);
    } catch (error) {
      console.error("Error fetching PMs:", error);
    }
  };

  const fetchEquipmentItems = async () => {
    try {
      const data = await api.get("/equipment_items");
      setEquipmentItems(data);
    } catch (error) {
      console.error("Error fetching equipment items:", error);
    }
  };

  const handleCreateList = async () => {
    try {
      const data = await api.post("/loading_lists", {
        loading_list: {
          date: date,
          return_date: returnDate,
          site_name: siteName,
          notes: notes,
          pm_id: user.id,
          status: "pending",
          team_id: selectedTeam,
        },
      });
      setLoadingLists([...loadingLists, data]);
      setOpenNewList(false);
      setDate(new Date());
      setSiteName("");
      setNotes("");
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error creating loading list:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PM Dashboard
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Loading Lists" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Welcome, {user.first_name} {user.last_name}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewList(true)}
                >
                  Create New Loading List
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LoadingListBoard
            loadingLists={loadingLists}
            equipmentItems={equipmentItems}
            teams={teams}
            setTeams={setTeams}
            pmList={pmList}
            setPmList={setPmList}
            onUpdateList={fetchLoadingLists}
          />
        </TabPanel>
      </Container>

      <Dialog open={openNewList} onClose={() => setOpenNewList(false)}>
        <DialogTitle>Create New Loading List</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Site Name"
            type="text"
            fullWidth
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
          <TextField
            margin="dense"
            type="date"
            label="Date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            margin="dense"
            type="date"
            label="Return Date"
            fullWidth
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          <Box>
            <Typography variant="h5">Select a Team</Typography>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              displayEmpty
            >
              <MenuItem value={null}>
                <em>None</em>
              </MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewList(false)}>Cancel</Button>
          <Button onClick={handleCreateList} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PMDashboard;
