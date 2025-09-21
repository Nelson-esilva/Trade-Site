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
  Card,
  CardContent,
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
    clearError 
  } = useApp();
  
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    offer_type: 'item',
    item_offered: '',
    money_amount: '',
  });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleCloseOfferDialog = () => {
    setShowOfferDialog(false);
    setOfferData({ 
      offer_type: 'item',
      item_offered: '',
      money_amount: '',
    });
  };

  const handleSubmitOffer = async () => {
    // Validação baseada no tipo de oferta
    if (offerData.offer_type === 'item' && !offerData.item_offered) {
      return;
    }
    if (offerData.offer_type === 'money' && !offerData.money_amount) {
      return;
    }

    try {
      const offerPayload = {
        item_desired: parseInt(id),
        offer_type: offerData.offer_type,
        status: 'pendente',
      };

      if (offerData.offer_type === 'item') {
        offerPayload.item_offered = parseInt(offerData.item_offered);
      } else if (offerData.offer_type === 'money') {
        offerPayload.money_amount = parseFloat(offerData.money_amount);
      }

      await createOffer(offerPayload);
      handleCloseOfferDialog();
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
    }
  };


  const handleChangeStatus = () => {
    setNewStatus(currentItem?.status || '');
    setShowStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setShowStatusDialog(false);
    setNewStatus('');
  };

  const handleSubmitStatusChange = async () => {
    try {
      const updatedItem = await apiService.request(`/items/${id}/change_status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      // Atualizar o item atual com o novo status
      setCurrentItem(updatedItem);
      
      handleCloseStatusDialog();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };



  // Itens disponíveis para troca (excluindo o item atual e apenas itens do usuário logado)
  const availableItems = items.filter(item => 
    item.id !== parseInt(id) && 
    item.status === 'disponivel' && 
    item.owner === user?.username
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentItem) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Item não encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Informações do Item */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {currentItem.title}
                </Typography>
                <Chip
                  label={currentItem.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                  color={currentItem.status === 'disponivel' ? 'success' : 'default'}
                  variant="outlined"
                />
          </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {currentItem.description}
            </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informações do Proprietário */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Proprietário
              </Typography>
              <Box sx={{ ml: 4 }}>
                <Typography variant="body1">
                  {currentItem.owner?.name || 'Usuário não informado'}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                  @{currentItem.owner?.username || 'username'}
                </Typography>
              </Box>
            </Box>

            {/* Data de Criação */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Data de Publicação
              </Typography>
              <Box sx={{ ml: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {new Date(currentItem.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Ações */}
            <Box sx={{ mt: 4 }}>
              {/* Botões de Admin */}
              {user && (user.is_trade_admin || user.is_superuser) && (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleChangeStatus}
                  >
                    Alterar Status
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    startIcon={<SwapIcon />}
                    onClick={handleMakeOffer}
                  >
                    Fazer Oferta (Admin)
                  </Button>
                </>
              )}
              
              {/* Botões normais */}
              <Button
                variant="contained"
                size="large"
                startIcon={<SwapIcon />}
                onClick={handleMakeOffer}
                disabled={currentItem.status !== 'disponivel'}
                sx={{ mr: 2 }}
              >
                Fazer Oferta
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
              >
                Ver Outros Itens
              </Button>
            </Box>
          </Paper>
        </Grid>

      </Grid>

      {/* Dialog para Fazer Oferta */}
      <Dialog open={showOfferDialog} onClose={handleCloseOfferDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Fazer Oferta</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Faça uma oferta por "{currentItem.title}"
            </Typography>
          
          {/* Tipo de Oferta */}
          <FormControl fullWidth sx={{ mt: 2 }}>
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

          {/* Campo condicional baseado no tipo */}
          {offerData.offer_type === 'item' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Seu Item</InputLabel>
              <Select
                value={offerData.item_offered}
                label="Seu Item"
                onChange={(e) => setOfferData({ ...offerData, item_offered: e.target.value })}
              >
                {availableItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {offerData.offer_type === 'money' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Valor em Dinheiro (R$)</InputLabel>
              <input
              type="number"
                step="0.01"
                min="0"
                value={offerData.money_amount}
                onChange={(e) => setOfferData({ ...offerData, money_amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  border: '1px solid #c4c4c4',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
                placeholder="0,00"
              />
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOfferDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitOffer}
            variant="contained"
            disabled={
              (offerData.offer_type === 'item' && !offerData.item_offered) ||
              (offerData.offer_type === 'money' && !offerData.money_amount)
            }
          >
            Enviar Oferta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Alterar Status */}
      <Dialog open={showStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Alterar Status do Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="disponivel">Disponível</MenuItem>
              <MenuItem value="indisponível">Indisponível</MenuItem>
              <MenuItem value="trocado">Trocado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitStatusChange}
            variant="contained"
            disabled={!newStatus}
          >
            Alterar Status
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ItemDetails;