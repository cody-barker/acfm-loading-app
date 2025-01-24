import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import PMDashboard from './components/pm/Dashboard';
import LoaderDashboard from './components/loader/Dashboard';
import theme from './theme';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <DndProvider backend={HTML5Backend}>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/pm/*"
                    element={
                      <ProtectedRoute requiredRole="pm">
                        <PMDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/loader/*"
                    element={
                      <ProtectedRoute requiredRole="loader">
                        <LoaderDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </Suspense>
            </DndProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
