import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  SwapHoriz as SwapIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';

const ItemDetails = () => {
  const [tabValue, setTabValue] = useState(0);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerType, setOfferType] = useState('money'); // 'money' ou 'item'
  const [moneyOffer, setMoneyOffer] = useState('');
  const [itemOffer, setItemOffer] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data
  const item = {
    id: 1,
    title: 'Livro de Cálculo I - James Stewart',
    description: 'Livro em excelente estado de conservação, usado apenas durante um semestre. Todas as páginas estão intactas, sem rabiscos ou anotações. Inclui CD-ROM com exercícios extras. Ideal para estudantes de engenharia e matemática.',
    category: 'Livros',
    condition: 'Muito Bom',
    images: [
      '/frontend/public/images/calculo1.jpg',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
    ],
    owner: {
      name: 'Maria Silva',
      avatar: '/api/placeholder/60/60',
      rating: 4.8,
      reviewCount: 23,
      memberSince: '2022',
      location: 'São Paulo, SP',
    },
    createdAt: '2024-01-15',
    offers: [
      {
        id: 1,
        user: 'João Santos',
        type: 'money',
        amount: 80,
        date: '2024-01-20',
        status: 'pending',
      },
      {
        id: 2,
        user: 'Ana Costa',
        type: 'item',
        itemName: 'Livro de Física - Halliday',
        date: '2024-01-19',
        status: 'accepted',
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOfferSubmit = () => {
    console.log('Oferta enviada:', { type: offerType, moneyOffer, itemOffer });
    setOfferDialogOpen(false);
    setMoneyOffer('');
    setItemOffer('');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Imagens do Item */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardMedia
              component="img"
              height="400"
              image={item.images[0]}
              alt={item.title}
              sx={{ borderRadius: 2 }}
            />
          </Card>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {item.images.slice(1).map((image, index) => (
              <Card key={index} elevation={0} sx={{ width: 100, height: 80, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="80"
                  image={image}
                  alt={`${item.title} ${index + 2}`}
                  sx={{ cursor: 'pointer', borderRadius: 2 }}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Informações do Item */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {item.title}
            </Typography>
            
            <Box display="flex" gap={1} mb={2}>
              <Chip label={item.category} color="primary" />
              <Chip label={item.condition} color="success" />
            </Box>

            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
              <LocationIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.owner.location}
              </Typography>
            </Box>

            {/* Ações */}
            <Box display="flex" gap={2} mb={3}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SwapIcon />}
                onClick={() => setOfferDialogOpen(true)}
                sx={{ flex: 1 }}
              >
                Fazer Oferta
              </Button>
              <Button
                variant="outlined"
                onClick={toggleFavorite}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              >
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
              <Button variant="outlined" startIcon={<ShareIcon />}>
                Compartilhar
              </Button>
            </Box>

            {/* Informações do Proprietário */}
            <Card sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Proprietário
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={item.owner.avatar} sx={{ width: 60, height: 60 }} />
                <Box>
                  <Typography variant="subtitle1">{item.owner.name}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={item.owner.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({item.owner.reviewCount} avaliações)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Membro desde {item.owner.memberSince}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} mt={2}>
                <Button variant="outlined" size="small" fullWidth>
                  Ver Perfil
                </Button>
                <Button variant="outlined" size="small" fullWidth>
                  Enviar Mensagem
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs com informações adicionais */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ofertas Recebidas" />
          <Tab label="Descrição Completa" />
          <Tab label="Políticas de Troca" />
        </Tabs>

        <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ofertas para este item ({item.offers.length})
              </Typography>
              <List>
                {item.offers.map((offer) => (
                  <ListItem key={offer.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        {offer.type === 'money' ? <MoneyIcon /> : <SwapIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        offer.type === 'money'
                          ? `R$ ${offer.amount}`
                          : offer.itemName
                      }
                      secondary={`Por ${offer.user} • ${offer.date} • ${offer.status === 'accepted' ? 'Aceita' : 'Pendente'}`}
                    />
                    <Chip
                      label={offer.status === 'accepted' ? 'Aceita' : 'Pendente'}
                      color={offer.status === 'accepted' ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Descrição Detalhada
              </Typography>
              <Typography variant="body1">
                {item.description}
              </Typography>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Políticas de Troca
              </Typography>
              <Typography variant="body1" paragraph>
                • Trocas preferencialmente presenciais na região de São Paulo
              </Typography>
              <Typography variant="body1" paragraph>
                • Aceito tanto ofertas em dinheiro quanto troca por outros livros
              </Typography>
              <Typography variant="body1" paragraph>
                • Item deve ser retirado em até 7 dias após confirmação da troca
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Dialog para fazer oferta */}
      <Dialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Fazer Oferta</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Oferta
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant={offerType === 'money' ? 'contained' : 'outlined'}
                onClick={() => setOfferType('money')}
                startIcon={<MoneyIcon />}
              >
                Dinheiro
              </Button>
              <Button
                variant={offerType === 'item' ? 'contained' : 'outlined'}
                onClick={() => setOfferType('item')}
                startIcon={<SwapIcon />}
              >
                Trocar por Item
              </Button>
            </Box>
          </Box>

          {offerType === 'money' ? (
            <TextField
              fullWidth
              label="Valor da Oferta (R$)"
              type="number"
              value={moneyOffer}
              onChange={(e) => setMoneyOffer(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
              }}
            />
          ) : (
            <TextField
              fullWidth
              label="Que item você quer oferecer?"
              multiline
              rows={3}
              value={itemOffer}
              onChange={(e) => setItemOffer(e.target.value)}
              placeholder="Descreva o item que você gostaria de oferecer em troca..."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleOfferSubmit} variant="contained">
            Enviar Oferta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails;