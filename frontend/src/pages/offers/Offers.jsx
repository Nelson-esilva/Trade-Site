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
    clearError,
  } = useApp();

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const getItemById = (itemId) => items.find(item => item.id === itemId);

  const statusColors = { aceita: 'success', recusada: 'error', pendente: 'warning' };
  const statusLabels = { aceita: 'Aceita', recusada: 'Recusada', pendente: 'Pendente' };

  const pendingOffers = offers.filter(o => o.status === 'pendente');
  const acceptedOffers = offers.filter(o => o.status === 'aceita');
  const refusedOffers = offers.filter(o => o.status === 'recusada');

  const renderOfferCard = (offer) => {
    const desiredItem = getItemById(offer.item_desired);
    const offeredItem = getItemById(offer.item_offered);

    return (
      <Card key={offer.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              Oferta #{offer.id}
            </Typography>
            <Chip
              label={statusLabels[offer.status] || offer.status}
              color={statusColors[offer.status] || 'default'}
              size="small"
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="overline" color="primary" sx={{ fontSize: '0.65rem' }}>
                  Item Desejado
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {desiredItem?.title || 'Item não encontrado'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por: {offer.offerer || 'Usuário'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="overline" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                  Item Oferecido
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {offeredItem?.title || 'Item não encontrado'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por: {offer.offerer || 'Usuário'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(offer.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </Typography>
          </Box>

          {offer.status === 'pendente' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button size="small" startIcon={<CheckIcon />} color="success" variant="contained" onClick={() => acceptOffer(offer.id)}>
                Aceitar
              </Button>
              <Button size="small" startIcon={<CancelIcon />} color="error" variant="outlined" onClick={() => refuseOffer(offer.id)}>
                Recusar
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {desiredItem && (
              <Button size="small" variant="outlined" onClick={() => navigate(`/item/${desiredItem.id}`)}>
                Ver Item Desejado
              </Button>
            )}
            {offeredItem && (
              <Button size="small" variant="outlined" onClick={() => navigate(`/item/${offeredItem.id}`)}>
                Ver Item Oferecido
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (icon, message, subtitle) => (
    <Box sx={{ textAlign: 'center', py: 10, px: 3, bgcolor: '#fff', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      {icon}
      <Typography variant="h5" sx={{ mb: 1 }}>{message}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Gerenciamento
      </Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Gerenciar Ofertas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Visualize e gerencie todas as ofertas de troca
      </Typography>

      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>{error}</Alert>}

      <Paper variant="outlined" sx={{ mb: 3, borderColor: 'divider', borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ minHeight: 48 }}>
          <Tab label={`Pendentes (${pendingOffers.length})`} icon={<TimeIcon />} iconPosition="start" />
          <Tab label={`Aceitas (${acceptedOffers.length})`} icon={<CheckIcon />} iconPosition="start" />
          <Tab label={`Recusadas (${refusedOffers.length})`} icon={<CancelIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {loadingOffers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <Box>
          {tabValue === 0 && (pendingOffers.length === 0
            ? renderEmptyState(<SwapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />, 'Nenhuma oferta pendente', 'Quando alguém fizer uma oferta por seus itens, ela aparecerá aqui')
            : pendingOffers.map(renderOfferCard))}
          {tabValue === 1 && (acceptedOffers.length === 0
            ? renderEmptyState(<CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />, 'Nenhuma oferta aceita', 'Ofertas aceitas aparecerão aqui')
            : acceptedOffers.map(renderOfferCard))}
          {tabValue === 2 && (refusedOffers.length === 0
            ? renderEmptyState(<CancelIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />, 'Nenhuma oferta recusada', 'Ofertas recusadas aparecerão aqui')
            : refusedOffers.map(renderOfferCard))}
        </Box>
      )}
    </Container>
  );
};

export default Offers;
