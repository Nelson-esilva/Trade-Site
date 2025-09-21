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
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentItem, 
    items, 
    offers, 
    loading, 
    error, 
    loadItem, 
    createOffer, 
    acceptOffer, 
    refuseOffer,
    clearError 
  } = useApp();
  
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    item_offered: '',
  });

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id, loadItem]);

  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleCloseOfferDialog = () => {
    setShowOfferDialog(false);
    setOfferData({ item_offered: '' });
  };

  const handleSubmitOffer = async () => {
    if (!offerData.item_offered) {
      return;
    }

    try {
      await createOffer({
        item_desired: parseInt(id),
        item_offered: parseInt(offerData.item_offered),
        status: 'pendente',
      });
      handleCloseOfferDialog();
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
    }
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

  // Filtrar ofertas relacionadas a este item
  const itemOffers = offers.filter(offer => 
    offer.item_desired === parseInt(id) || offer.item_offered === parseInt(id)
  );

  // Itens disponíveis para troca (excluindo o item atual)
  const availableItems = items.filter(item => 
    item.id !== parseInt(id) && item.status === 'disponivel'
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
        <Grid item xs={12} md={8}>
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

        {/* Ofertas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ofertas ({itemOffers.length})
            </Typography>
            
            {itemOffers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma oferta ainda
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {itemOffers.map((offer) => (
                  <Card key={offer.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Oferta #{offer.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status: {offer.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Por: {offer.offerer?.name || 'Usuário'}
                      </Typography>
                      
                      {offer.status === 'pendente' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<CheckIcon />}
                            color="success"
                            onClick={() => handleAcceptOffer(offer.id)}
                          >
                            Aceitar
                          </Button>
                          <Button
                            size="small"
                            startIcon={<CancelIcon />}
                            color="error"
                            onClick={() => handleRefuseOffer(offer.id)}
                          >
                            Recusar
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para Fazer Oferta */}
      <Dialog open={showOfferDialog} onClose={handleCloseOfferDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Fazer Oferta</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecione um item seu para trocar por "{currentItem.title}"
          </Typography>
          
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOfferDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitOffer}
            variant="contained"
            disabled={!offerData.item_offered}
          >
            Enviar Oferta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails;