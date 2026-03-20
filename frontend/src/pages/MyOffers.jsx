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
  CardMedia,
  Paper,
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

const categoryIcons = {
  livros: <BookIcon sx={{ fontSize: 18 }} />,
  apostilas: <SchoolIcon sx={{ fontSize: 18 }} />,
  equipamentos: <ScienceIcon sx={{ fontSize: 18 }} />,
  tecnologia: <ComputerIcon sx={{ fontSize: 18 }} />,
};

const statusMap = {
  pendente: { label: 'Pendente', color: 'warning' },
  aceita: { label: 'Aceita', color: 'success' },
  recusada: { label: 'Recusada', color: 'error' },
  trocado: { label: 'Trocado', color: 'success' },
  cancelada: { label: 'Cancelada', color: 'default' },
};

const MyOffers = () => {
  const { user, isAuthenticated, offers, loadOffers, acceptOffer, refuseOffer } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', offer: null });

  useEffect(() => {
    if (isAuthenticated) loadOffers();
  }, [isAuthenticated, loadOffers]);

  const receivedOffers = Array.isArray(offers)
    ? offers.filter(o => o.item_desired_data?.owner === user?.username && o.status === 'pendente')
    : [];
  const sentOffers = Array.isArray(offers)
    ? offers.filter(o => o.offerer === user?.username && o.status === 'pendente')
    : [];
  const historicalOffers = Array.isArray(offers)
    ? offers.filter(o =>
        (o.item_desired_data?.owner === user?.username || o.offerer === user?.username) &&
        ['aceita', 'recusada', 'trocado'].includes(o.status)
      )
    : [];

  const handleConfirmAction = async () => {
    if (!confirmDialog.offer) return;
    setLoading(true);
    try {
      if (confirmDialog.type === 'accept') await acceptOffer(confirmDialog.offer.id);
      else await refuseOffer(confirmDialog.offer.id);
      setConfirmDialog({ open: false, type: '', offer: null });
    } catch (err) {
      setError(`Erro ao ${confirmDialog.type === 'accept' ? 'aceitar' : 'recusar'} oferta`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning">Você precisa estar logado para acessar suas ofertas.</Alert>
      </Container>
    );
  }

  const renderOfferCard = (offer, type) => {
    const status = statusMap[offer.status] || { label: offer.status, color: 'default' };
    return (
      <Grid item xs={12} key={offer.id}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {type === 'received' ? `Oferta de ${offer.offerer}` :
                     type === 'sent' ? `Oferta para ${offer.item_desired_data?.owner}` :
                     (offer.offerer === user?.username ? `Oferta para ${offer.item_desired_data?.owner}` : `Oferta de ${offer.offerer}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{formatDate(offer.created_at)}</Typography>
                </Box>
              </Box>
              <Chip label={status.label} color={status.color} size="small" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                  {type === 'received' ? 'Seu Item' : 'Item Desejado'}
                </Typography>
                {type === 'received' ? (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 0.5 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                      image={offer.item_desired_data?.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop'}
                      alt={offer.item_desired_data?.title}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{offer.item_desired_data?.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {offer.item_desired_data?.description}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {categoryIcons[offer.item_desired_data?.category] || <BookIcon sx={{ fontSize: 18 }} />}
                    <Typography variant="body2" fontWeight={500}>{offer.item_desired_data?.title}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                  {offer.offer_type === 'item' ? (type === 'received' ? 'Item Oferecido' : 'Seu Item') : 'Valor Oferecido'}
                </Typography>
                {offer.offer_type === 'item' ? (
                  type === 'received' ? (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 0.5 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                        image={offer.item_offered_data?.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop'}
                        alt={offer.item_offered_data?.title}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{offer.item_offered_data?.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {offer.item_offered_data?.description}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {categoryIcons[offer.item_offered_data?.category] || <BookIcon sx={{ fontSize: 18 }} />}
                      <Typography variant="body2" fontWeight={500}>{offer.item_offered_data?.title}</Typography>
                    </Box>
                  )
                ) : (
                  <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
                    R$ {offer.money_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>

          {offer.status === 'pendente' && type === 'received' && (
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button size="small" color="success" variant="contained" startIcon={<AcceptIcon />} onClick={() => setConfirmDialog({ open: true, type: 'accept', offer })}>
                Aceitar
              </Button>
              <Button size="small" color="error" variant="outlined" startIcon={<RejectIcon />} onClick={() => setConfirmDialog({ open: true, type: 'reject', offer })}>
                Recusar
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>
    );
  };

  const renderEmptyState = (icon, title, subtitle) => (
    <Box sx={{ textAlign: 'center', py: 10, px: 3, bgcolor: '#fff', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      {icon}
      <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Negociações
      </Typography>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Minhas Ofertas
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper variant="outlined" sx={{ mb: 3, borderColor: 'divider', borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ minHeight: 48 }}>
          <Tab label={`Recebidas (${receivedOffers.length})`} icon={<SwapIcon />} iconPosition="start" />
          <Tab label={`Enviadas (${sentOffers.length})`} icon={<SwapIcon />} iconPosition="start" />
          <Tab label={`Histórico (${historicalOffers.length})`} icon={<AcceptIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (receivedOffers.length === 0
        ? renderEmptyState(<SwapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />, 'Nenhuma oferta recebida', 'Quando alguém fizer uma oferta para seus itens, ela aparecerá aqui.')
        : <Grid container spacing={2}>{receivedOffers.map(o => renderOfferCard(o, 'received'))}</Grid>)}

      {tabValue === 1 && (sentOffers.length === 0
        ? renderEmptyState(<SwapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />, 'Nenhuma oferta enviada', 'Quando você fizer uma oferta, ela aparecerá aqui.')
        : <Grid container spacing={2}>{sentOffers.map(o => renderOfferCard(o, 'sent'))}</Grid>)}

      {tabValue === 2 && (historicalOffers.length === 0
        ? renderEmptyState(<AcceptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />, 'Nenhuma oferta no histórico', 'Ofertas aceitas, recusadas ou trocadas aparecerão aqui.')
        : <Grid container spacing={2}>{historicalOffers.map(o => renderOfferCard(o, 'history'))}</Grid>)}

      {/* Confirm dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, type: '', offer: null })}>
        <DialogTitle>{confirmDialog.type === 'accept' ? 'Aceitar Oferta' : 'Recusar Oferta'}</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja {confirmDialog.type === 'accept' ? 'aceitar' : 'recusar'} esta oferta?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDialog({ open: false, type: '', offer: null })}>Cancelar</Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.type === 'accept' ? 'success' : 'error'}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : (confirmDialog.type === 'accept' ? <AcceptIcon /> : <RejectIcon />)}
          >
            {loading ? 'Processando…' : (confirmDialog.type === 'accept' ? 'Aceitar' : 'Recusar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOffers;
