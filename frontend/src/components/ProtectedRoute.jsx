import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { CircularProgress, Box, Container } from '@mui/material';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useApp();
  const location = useLocation();

  // Se ainda está carregando e requer autenticação, mostra loading
  if (loading && requireAuth) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se usuário está logado mas tentando acessar login/register
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se requer roles específicos
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.some(role => {
      if (role === 'admin') {
        return user.is_superuser || user.is_trade_admin;
      }
      if (role === 'superuser') {
        return user.is_superuser;
      }
      if (role === 'trade_admin') {
        return user.is_trade_admin;
      }
      return false;
    });

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
