import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Offers = () => {
  const navigate = useNavigate();
  const { 
    offers, 
    items, 
    loadingOffers, 
    error, 
    loadOffers, 
    acceptOffer, 
    refuseOffer,
    clearError 
  } = useApp();
  
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOffer(offerId);
    } catch (error) {
      console.error('Erro ao aceitar oferta:', error);
    }
  };

  const handleRefuseOffer = async (offerId) => {
    try {
      await refuseOffer(offerId);
    } catch (error) {
      console.error('Erro ao recusar oferta:', error);
    }
  };

  const getItemById = (itemId) => {
    return items.find(item => item.id === itemId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aceita':
        return 'success';
      case 'recusada':
        return 'error';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'aceita':
        return 'Aceita';
      case 'recusada':
        return 'Recusada';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  // Filtrar ofertas por status
  const pendingOffers = offers.filter(offer => offer.status === 'pendente');
  const acceptedOffers = offers.filter(offer => offer.status === 'aceita');
  const refusedOffers = offers.filter(offer => offer.status === 'recusada');

  const renderOfferCard = (offer) => {
    const desiredItem = getItemById(offer.item_desired);
    const offeredItem = getItemById(offer.item_offered);

    return (
      <Card key={offer.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6">
              Oferta #{offer.id}
            </Typography>
            <Chip
              label={getStatusLabel(offer.status)}
              color={getStatusColor(offer.status)}
              size="small"
            />
          </Box>

          <Grid container spacing={2}>
            {/* Item Desejado */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Item Desejado
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {desiredItem?.title || 'Item não encontrado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por: {offer.offerer?.name || 'Usuário'}
                </Typography>
              </Box>
            </Grid>

            {/* Item Oferecido */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="secondary" gutterBottom>
                  Item Oferecido
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {offeredItem?.title || 'Item não encontrado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por: {offer.offerer?.name || 'Usuário'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Data da Oferta */}
          <Box display="flex" alignItems="center" mt={2} mb={2}>
            <TimeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(offer.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>

          {/* Ações */}
          {offer.status === 'pendente' && (
            <Box display="flex" gap={1} mt={2}>
              <Button
                size="small"
                startIcon={<CheckIcon />}
                color="success"
                variant="contained"
                onClick={() => handleAcceptOffer(offer.id)}
              >
                Aceitar
              </Button>
              <Button
                size="small"
                startIcon={<CancelIcon />}
                color="error"
                variant="outlined"
                onClick={() => handleRefuseOffer(offer.id)}
              >
                Recusar
              </Button>
            </Box>
          )}

          {/* Ações para itens */}
          <Box display="flex" gap={1} mt={2}>
            {desiredItem && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/item/${desiredItem.id}`)}
              >
                Ver Item Desejado
              </Button>
            )}
            {offeredItem && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/item/${offeredItem.id}`)}
              >
                Ver Item Oferecido
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Gerenciar Ofertas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize e gerencie todas as ofertas de troca
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={`Pendentes (${pendingOffers.length})`} 
            icon={<TimeIcon />}
          />
          <Tab 
            label={`Aceitas (${acceptedOffers.length})`} 
            icon={<CheckIcon />}
          />
          <Tab 
            label={`Recusadas (${refusedOffers.length})`} 
            icon={<CancelIcon />}
          />
        </Tabs>
      </Paper>

      {/* Content */}
      {loadingOffers ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ofertas Pendentes
              </Typography>
              {pendingOffers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <SwapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhuma oferta pendente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quando alguém fizer uma oferta por seus itens, ela aparecerá aqui
                  </Typography>
                </Box>
              ) : (
                pendingOffers.map(renderOfferCard)
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ofertas Aceitas
              </Typography>
              {acceptedOffers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhuma oferta aceita
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ofertas aceitas aparecerão aqui
                  </Typography>
                </Box>
              ) : (
                acceptedOffers.map(renderOfferCard)
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ofertas Recusadas
              </Typography>
              {refusedOffers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhuma oferta recusada
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ofertas recusadas aparecerão aqui
                  </Typography>
                </Box>
              ) : (
                refusedOffers.map(renderOfferCard)
              )}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Offers;
