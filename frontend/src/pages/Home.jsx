import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
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

  // Categorias com contagem dinâmica
  const categories = [
    { 
      name: 'Livros', 
      key: 'livros',
      icon: <BookIcon fontSize="large" />, 
      count: Array.isArray(items) ? items.filter(item => item.category === 'livros').length : 0 
    },
    { 
      name: 'Apostilas', 
      key: 'apostilas',
      icon: <SchoolIcon fontSize="large" />, 
      count: Array.isArray(items) ? items.filter(item => item.category === 'apostilas').length : 0 
    },
    { 
      name: 'Equipamentos', 
      key: 'equipamentos',
      icon: <ScienceIcon fontSize="large" />, 
      count: Array.isArray(items) ? items.filter(item => item.category === 'equipamentos').length : 0 
    },
    { 
      name: 'Tecnologia', 
      key: 'tecnologia',
      icon: <ComputerIcon fontSize="large" />, 
      count: Array.isArray(items) ? items.filter(item => item.category === 'tecnologia').length : 0 
    },
  ];

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchItems(searchTerm, searchFilters);
    } else {
      await loadItems();
    }
  };

  const handleCategoryClick = async (category) => {
    // Se clicou na mesma categoria, limpar o filtro
    if (searchFilters.category === category.key) {
      const newFilters = { ...searchFilters, category: '' };
      setSearchFilters(newFilters);
      await loadItems(); // Carregar todos os itens
    } else {
      // Aplicar filtro da categoria
      const newFilters = { ...searchFilters, category: category.key };
      setSearchFilters(newFilters);
      await searchItems('', newFilters);
    }
  };


  const handleItemClick = (item) => {
    navigate(`/item/${item.id}`);
  };

  const handleMakeOffer = (item) => {
    navigate(`/item/${item.id}`);
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
                  backgroundColor: searchFilters.category === category.key ? 'primary.light' : 'background.paper',
                  border: searchFilters.category === category.key ? '2px solid' : '1px solid',
                  borderColor: searchFilters.category === category.key ? 'primary.main' : 'divider',
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
        ) : !Array.isArray(items) || items.length === 0 ? (
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
          <Grid container spacing={2}>
            {Array.isArray(items) && items.filter(item => item && item.title).map((item, index) => {
              // Imagens de exemplo baseadas no título do item
              const getExampleImage = (title) => {
                if (!title || typeof title !== 'string') {
                  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
                }
                
                const lowerTitle = title.toLowerCase();
                if (lowerTitle.includes('livro') || lowerTitle.includes('cálculo')) {
                  return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop';
                } else if (lowerTitle.includes('apostila') || lowerTitle.includes('programação')) {
                  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop';
                } else if (lowerTitle.includes('microscópio') || lowerTitle.includes('equipamento')) {
                  return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop';
                } else if (lowerTitle.includes('tecnologia') || lowerTitle.includes('computador')) {
                  return 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop';
                } else {
                  // Imagens alternativas para outros itens
                  const defaultImages = [
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
                  ];
                  return defaultImages[index % defaultImages.length];
                }
              };

              return (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <ItemCard
                    item={{
                      ...item,
                      category: item.category || 'livros',
                      location: item.location || 'Local não informado',
                      offerCount: item.offerCount || 0,
                      image: item.image_url_or_upload || item.image_url || getExampleImage(item.title),
                      condition: item.condition || 'Bom estado',
                      status: item.status || 'disponivel',
                    }}
                    compact={true}
                    onViewDetails={handleItemClick}
                    onMakeOffer={handleMakeOffer}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

    </Container>
  );
};

export default Home;