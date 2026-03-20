import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  SwapHoriz as SwapIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import apiService from '../../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentItem,
    setCurrentItem,
    items,
    loading,
    error,
    user,
    loadItem,
    createOffer,
    clearError,
  } = useApp();

  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({ offer_type: 'item', item_offered: '', money_amount: '' });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const isOwnItem = currentItem?.owner === user?.username;

  useEffect(() => {
    if (!id) return;
    // Evita refetch em loop quando o item atual já corresponde à rota.
    if (currentItem && String(currentItem.id) === String(id)) return;
    loadItem(id).catch(() => {
      // O erro já é tratado no contexto via estado global `error`.
    });
  }, [id, currentItem, loadItem]);

  const handleSubmitOffer = async () => {
    if (offerData.offer_type === 'item' && !offerData.item_offered) return;
    if (offerData.offer_type === 'money' && !offerData.money_amount) return;

    try {
      const payload = {
        item_desired: parseInt(id),
        offer_type: offerData.offer_type,
        status: 'pendente',
      };
      if (offerData.offer_type === 'item') payload.item_offered = parseInt(offerData.item_offered);
      else if (offerData.offer_type === 'money') payload.money_amount = parseFloat(offerData.money_amount);

      await createOffer(payload);
      setShowOfferDialog(false);
      setOfferData({ offer_type: 'item', item_offered: '', money_amount: '' });
    } catch (err) {
      console.error('Erro ao criar oferta:', err);
    }
  };

  const handleSubmitStatusChange = async () => {
    try {
      const updatedItem = await apiService.request(`/items/${id}/change_status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrentItem(updatedItem);
      setShowStatusDialog(false);
      setNewStatus('');
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const availableItems = items.filter(item =>
    item.id !== parseInt(id) && item.status === 'disponivel' && item.owner === user?.username
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" onClose={clearError}>{error}</Alert>
      </Container>
    );
  }

  if (!currentItem) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning">Item não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Voltar
      </Button>

      <Grid container spacing={4}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="400"
              image={currentItem.image_url_or_upload || currentItem.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'}
              alt={currentItem.title}
              sx={{ objectFit: 'cover', width: '100%' }}
            />
          </Paper>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 4, borderColor: 'divider', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h3" component="h1">
                {currentItem.title}
              </Typography>
              <Chip
                label={currentItem.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                color={currentItem.status === 'disponivel' ? 'success' : 'default'}
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              {currentItem.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Proprietário</Typography>
                  <Typography variant="body2" fontWeight={500}>{currentItem.owner || 'Não informado'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Publicado em</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(currentItem.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 4 }}>
              {user && (user.is_trade_admin || user.is_superuser) && (
                <Button variant="outlined" color="secondary" onClick={() => { setNewStatus(currentItem?.status || ''); setShowStatusDialog(true); }}>
                  Alterar Status
                </Button>
              )}
              {!isOwnItem && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SwapIcon />}
                  onClick={() => setShowOfferDialog(true)}
                  disabled={currentItem.status !== 'disponivel'}
                >
                  Fazer Oferta
                </Button>
              )}
              <Button variant="outlined" onClick={() => navigate('/')}>
                Ver Outros Itens
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Offer dialog */}
      <Dialog open={showOfferDialog} onClose={() => setShowOfferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Fazer Oferta</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Faça uma oferta por &ldquo;{currentItem.title}&rdquo;
          </Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Tipo de Oferta</InputLabel>
            <Select
              value={offerData.offer_type}
              label="Tipo de Oferta"
              onChange={(e) => setOfferData({ ...offerData, offer_type: e.target.value, item_offered: '', money_amount: '' })}
            >
              <MenuItem value="item">Trocar por Item</MenuItem>
              <MenuItem value="money">Oferta em Dinheiro</MenuItem>
            </Select>
          </FormControl>

          {offerData.offer_type === 'item' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Seu Item</InputLabel>
              <Select value={offerData.item_offered} label="Seu Item" onChange={(e) => setOfferData({ ...offerData, item_offered: e.target.value })}>
                {availableItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {offerData.offer_type === 'money' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel shrink>Valor em Dinheiro (R$)</InputLabel>
              <input
                type="number"
                step="0.01"
                min="0"
                value={offerData.money_amount}
                onChange={(e) => setOfferData({ ...offerData, money_amount: e.target.value })}
                style={{ width: '100%', padding: '16.5px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', marginTop: '8px' }}
                placeholder="0,00"
              />
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowOfferDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmitOffer}
            variant="contained"
            disabled={(offerData.offer_type === 'item' && !offerData.item_offered) || (offerData.offer_type === 'money' && !offerData.money_amount)}
          >
            Enviar Oferta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>Alterar Status do Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)}>
              <MenuItem value="disponivel">Disponível</MenuItem>
              <MenuItem value="indisponível">Indisponível</MenuItem>
              <MenuItem value="trocado">Trocado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowStatusDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmitStatusChange} variant="contained" disabled={!newStatus}>Alterar Status</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails;
