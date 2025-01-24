import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { api } from '../../utils/api';
import LoadingListDetail from './LoadingListDetail';

const LoadingListBoard = ({ loadingLists, onUpdateList }) => {
  const [selectedList, setSelectedList] = useState(null);

  const handleCreateList = async () => {
    try {
      const response = await api.post('/loading_lists', {
        loading_list: {
          date: new Date().toISOString().split('T')[0],
          site_name: 'New Loading List',
          notes: ''
        }
      });
      
      await onUpdateList();
      handleSelectList(response.id);
    } catch (error) {
      console.error('Error creating loading list:', error);
    }
  };

  const handleDeleteList = async (event, listId) => {
    event.stopPropagation();
    try {
      await api.delete(`/loading_lists/${listId}`);
      onUpdateList();
    } catch (error) {
      console.error('Error deleting loading list:', error);
    }
  };

  const handleSelectList = async (list) => {
    try {
      const freshData = await api.get(`/loading_lists/${list.id}`);
      setSelectedList(freshData);
    } catch (error) {
      console.error('Error fetching loading list details:', error);
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
            const freshData = await api.get(`/loading_lists/${selectedList.id}`);
            setSelectedList(freshData);
          } catch (error) {
            console.error('Error refreshing loading list details:', error);
          }
        }}
      />
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Loading Lists</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateList}
        >
          Create Loading List
        </Button>
      </Box>

      <Grid container spacing={2}>
        {loadingLists.map((list) => (
          <Grid item xs={12} sm={6} md={4} key={list.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                position: 'relative'
              }}
              onClick={() => handleSelectList(list)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                    {list.site_name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteList(e, list.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      '&:hover': { color: 'error.main' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(list.date).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip 
                    label={`${list.loading_list_items?.length || 0} items`}
                    size="small"
                    color="primary"
                    variant="outlined"
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
  );
};

export default LoadingListBoard;
