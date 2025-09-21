import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const MyOffers = () => {
  const { user, isAuthenticated, offers, loadOffers, acceptOffer, refuseOffer } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: '',
    offer: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadOffers();
    }
  }, [isAuthenticated, loadOffers]);

  // Filtrar ofertas recebidas e enviadas
  const receivedOffers = Array.isArray(offers) 
    ? offers.filter(offer => offer.item?.owner === user?.username)
    : [];
  
  const sentOffers = Array.isArray(offers) 
    ? offers.filter(offer => offer.offerer === user?.username)
    : [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcceptOffer = (offer) => {
    setConfirmDialog({
      open: true,
      type: 'accept',
      offer: offer,
    });
  };

  const handleRejectOffer = (offer) => {
    setConfirmDialog({
      open: true,
      type: 'reject',
      offer: offer,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.offer) return;

    setLoading(true);
    try {
      if (confirmDialog.type === 'accept') {
        await acceptOffer(confirmDialog.offer.id);
      } else {
        await refuseOffer(confirmDialog.offer.id);
      }
      setConfirmDialog({ open: false, type: '', offer: null });
    } catch (err) {
      setError(`Erro ao ${confirmDialog.type === 'accept' ? 'aceitar' : 'recusar'} oferta`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'livros': <BookIcon />,
      'apostilas': <SchoolIcon />,
      'equipamentos': <ScienceIcon />,
      'tecnologia': <ComputerIcon />,
    };
    return icons[category] || <BookIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'warning',
      'aceita': 'success',
      'recusada': 'error',
      'cancelada': 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendente': 'Pendente',
      'aceita': 'Aceita',
      'recusada': 'Recusada',
      'cancelada': 'Cancelada',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar suas ofertas.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Minhas Ofertas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={`Ofertas Recebidas (${receivedOffers.length})`} 
            icon={<SwapIcon />}
            iconPosition="start"
          />
          <Tab 
            label={`Ofertas Enviadas (${sentOffers.length})`} 
            icon={<SwapIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Ofertas Recebidas */}
      {tabValue === 0 && (
        <Box>
          {receivedOffers.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <SwapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhuma oferta recebida
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quando alguém fizer uma oferta para seus itens, ela aparecerá aqui.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {receivedOffers.map((offer) => (
                <Grid item xs={12} key={offer.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              Oferta de {offer.offerer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(offer.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={getStatusLabel(offer.status)}
                          color={getStatusColor(offer.status)}
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Seu Item:
                          </Typography>
                          <Box display="flex" alignItems="center" mb={1}>
                            {getCategoryIcon(offer.item?.category)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {offer.item?.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {offer.item?.description}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Item Oferecido:
                          </Typography>
                          <Box display="flex" alignItems="center" mb={1}>
                            {getCategoryIcon(offer.offered_item?.category)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {offer.offered_item?.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {offer.offered_item?.description}
                          </Typography>
                        </Grid>
                      </Grid>

                      {offer.message && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Mensagem:
                          </Typography>
                          <Typography variant="body2">
                            {offer.message}
                          </Typography>
                        </>
                      )}
                    </CardContent>

                    {offer.status === 'pendente' && (
                      <CardActions>
                        <Button
                          color="success"
                          startIcon={<AcceptIcon />}
                          onClick={() => handleAcceptOffer(offer)}
                        >
                          Aceitar
                        </Button>
                        <Button
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() => handleRejectOffer(offer)}
                        >
                          Recusar
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Ofertas Enviadas */}
      {tabValue === 1 && (
        <Box>
          {sentOffers.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <SwapIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhuma oferta enviada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quando você fizer uma oferta, ela aparecerá aqui.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {sentOffers.map((offer) => (
                <Grid item xs={12} key={offer.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              Oferta para {offer.item?.owner}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(offer.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={getStatusLabel(offer.status)}
                          color={getStatusColor(offer.status)}
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Item Desejado:
                          </Typography>
                          <Box display="flex" alignItems="center" mb={1}>
                            {getCategoryIcon(offer.item?.category)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {offer.item?.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {offer.item?.description}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Seu Item:
                          </Typography>
                          <Box display="flex" alignItems="center" mb={1}>
                            {getCategoryIcon(offer.offered_item?.category)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {offer.offered_item?.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {offer.offered_item?.description}
                          </Typography>
                        </Grid>
                      </Grid>

                      {offer.message && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Sua Mensagem:
                          </Typography>
                          <Typography variant="body2">
                            {offer.message}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, type: '', offer: null })}>
        <DialogTitle>
          {confirmDialog.type === 'accept' ? 'Aceitar Oferta' : 'Recusar Oferta'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja {confirmDialog.type === 'accept' ? 'aceitar' : 'recusar'} esta oferta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, type: '', offer: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.type === 'accept' ? 'success' : 'error'}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : (confirmDialog.type === 'accept' ? <AcceptIcon /> : <RejectIcon />)}
          >
            {loading ? 'Processando...' : (confirmDialog.type === 'accept' ? 'Aceitar' : 'Recusar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOffers;
