import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ItemCard from '../components/ItemCard';

const Home = () => {
  const navigate = useNavigate();
  const { 
    items, 
    loadingItems, 
    error, 
    searchItems, 
    loadItems,
    clearError 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    status: 'disponivel',
  });

  // Carregar itens quando o componente monta
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Categorias estáticas (podem ser dinâmicas no futuro)
  const categories = [
    { name: 'Livros', icon: <BookIcon fontSize="large" />, count: items.filter(item => item.title?.toLowerCase().includes('livro')).length },
    { name: 'Apostilas', icon: <SchoolIcon fontSize="large" />, count: items.filter(item => item.title?.toLowerCase().includes('apostila')).length },
    { name: 'Equipamentos', icon: <ScienceIcon fontSize="large" />, count: items.filter(item => item.title?.toLowerCase().includes('equipamento')).length },
    { name: 'Tecnologia', icon: <ComputerIcon fontSize="large" />, count: items.filter(item => item.title?.toLowerCase().includes('tecnologia')).length },
  ];

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchItems(searchTerm, searchFilters);
    } else {
      await loadItems();
    }
  };

  const handleCategoryClick = async (category) => {
    setSearchFilters({ ...searchFilters, category: category.name });
    await searchItems('', { ...searchFilters, category: category.name });
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item.id}`);
  };

  const handleMakeOffer = (item) => {
    navigate(`/item/${item.id}#offer`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      {/* Hero Section */}
      <Box textAlign="center" mb={6} sx={{ backgroundColor: 'primary.main', color: 'white', py: 8, borderRadius: 2 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Descubra, participe, conecte-se.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Encontre os materiais didáticos mais relevantes para você
        </Typography>
        <Typography variant="body1" mb={4}>
          Troque livros, apostilas e equipamentos educacionais ou ofereça os seus
        </Typography>

        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 2, maxWidth: 600, mx: 'auto', borderRadius: 2 }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: 100 }}
              disabled={loadingItems}
            >
              {loadingItems ? <CircularProgress size={20} /> : 'Buscar'}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Categories */}
      <Box mb={6}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Materiais por Área
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={6} sm={3} key={category.name}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  textAlign: 'center',
                  p: 2,
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent>
                  <Box color="primary.main" mb={1}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} itens
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Items Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Itens Disponíveis'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create-item')}
            sx={{ minWidth: 150 }}
          >
            Adicionar Item
          </Button>
        </Box>

        {loadingItems ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum item encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchTerm 
                ? 'Tente ajustar sua busca ou filtros'
                : 'Seja o primeiro a adicionar um item!'
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create-item')}
            >
              Adicionar Primeiro Item
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ItemCard
                  item={{
                    ...item,
                    category: 'Geral', // Categoria padrão
                    location: 'Local não informado',
                    offerCount: 0,
                    image: '/api/placeholder/300/200',
                  }}
                  onViewDetails={handleItemClick}
                  onMakeOffer={handleMakeOffer}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;