import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { CircularProgress, Box, Container } from '@mui/material';

const ProfileProtection = ({ children }) => {
  const { user, isAuthenticated, loading } = useApp();
  const { username } = useParams();

  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se não é o próprio perfil e não é admin, redireciona para o próprio perfil
  if (username && username !== user?.username && !user?.is_superuser && !user?.is_trade_admin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProfileProtection;
