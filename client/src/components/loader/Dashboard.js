import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';

function LoaderDashboard() {
  const { logout, user } = useAuth0();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Loader Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={() => logout()}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 10,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Active Tasks */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Today's Loading Tasks
                </Typography>
                {/* Add loading tasks kanban board here */}
              </Paper>
            </Grid>

            {/* Current Loading List */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Current Loading List
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button variant="contained" color="success">
                    Mark as Staged
                  </Button>
                  <Button variant="contained" color="primary">
                    Mark as Loaded
                  </Button>
                </Box>
                {/* Add current loading list component here */}
              </Paper>
            </Grid>

            {/* Loading Progress */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Loading Progress
                </Typography>
                {/* Add progress tracking component here */}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LoaderDashboard;
