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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  MenuBook as BookIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
  ArrowForward as ArrowForwardIcon,
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
    clearError,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({ category: '', status: 'disponivel' });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const categories = [
    { name: 'Livros', key: 'livros', icon: <BookIcon />, count: Array.isArray(items) ? items.filter(i => i.category === 'livros').length : 0 },
    { name: 'Apostilas', key: 'apostilas', icon: <SchoolIcon />, count: Array.isArray(items) ? items.filter(i => i.category === 'apostilas').length : 0 },
    { name: 'Equipamentos', key: 'equipamentos', icon: <ScienceIcon />, count: Array.isArray(items) ? items.filter(i => i.category === 'equipamentos').length : 0 },
    { name: 'Tecnologia', key: 'tecnologia', icon: <ComputerIcon />, count: Array.isArray(items) ? items.filter(i => i.category === 'tecnologia').length : 0 },
  ];

  const handleSearch = async () => {
    if (searchTerm.trim()) await searchItems(searchTerm, searchFilters);
    else await loadItems();
  };

  const handleCategoryClick = async (category) => {
    if (searchFilters.category === category.key) {
      setSearchFilters({ ...searchFilters, category: '' });
      await loadItems();
    } else {
      const newFilters = { ...searchFilters, category: category.key };
      setSearchFilters(newFilters);
      await searchItems('', newFilters);
    }
  };

  const getExampleImage = (title, index) => {
    if (!title || typeof title !== 'string') {
      return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
    }
    const lower = title.toLowerCase();
    if (lower.includes('livro') || lower.includes('c\u00E1lculo'))
      return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
    if (lower.includes('apostila') || lower.includes('programa\u00E7\u00E3o'))
      return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop';
    if (lower.includes('microsc\u00F3pio') || lower.includes('equipamento'))
      return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop';
    const defaults = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    ];
    return defaults[index % defaults.length];
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%)',
          color: '#fff',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 640 }}>
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, display: 'block' }}
            >
              Plataforma universit\u00E1ria de trocas
            </Typography>
            <Typography variant="h1" sx={{ mb: 2, color: '#fff' }}>
              Troque materiais com mais agilidade
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 480, lineHeight: 1.7 }}
            >
              Publique itens, receba propostas e gerencie ofertas em um \u00FAnico fluxo.
              Cat\u00E1logo com foco em confian\u00E7a, clareza e velocidade.
            </Typography>
          </Box>

          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              maxWidth: 560,
              bgcolor: '#fff',
              borderRadius: 3,
              p: 0.75,
            }}
          >
            <TextField
              fullWidth
              placeholder="O que voc\u00EA est\u00E1 procurando?"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loadingItems}
              sx={{ px: 3, borderRadius: 2.5, flexShrink: 0 }}
            >
              {loadingItems ? <CircularProgress size={20} color="inherit" /> : 'Buscar'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Categories */}
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Categorias
          </Typography>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Materiais por \u00C1rea
          </Typography>
          <Grid container spacing={2}>
            {categories.map((cat) => {
              const isActive = searchFilters.category === cat.key;
              return (
                <Grid item xs={6} sm={3} key={cat.key}>
                  <Card
                    onClick={() => handleCategoryClick(cat)}
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      py: 2.5,
                      px: 2,
                      bgcolor: isActive ? 'primary.main' : '#fff',
                      color: isActive ? '#fff' : 'text.primary',
                      border: isActive ? '1.5px solid' : '1px solid',
                      borderColor: isActive ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: isActive ? 'primary.main' : 'primary.light',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: '0 !important' }}>
                      <Box sx={{ color: isActive ? '#fff' : 'primary.main', mb: 1 }}>
                        {cat.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        {cat.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}
                      >
                        {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Items */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Cat\u00E1logo
              </Typography>
              <Typography variant="h3">
                {searchTerm ? `Resultados para \u201C${searchTerm}\u201D` : 'Itens Dispon\u00EDveis'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/create-item')}
            >
              Adicionar Item
            </Button>
          </Box>

          {loadingItems ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(items) || items.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                px: 3,
                bgcolor: '#fff',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" sx={{ mb: 1 }}>
                Nenhum item encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Seja o primeiro a adicionar um item!'}
              </Typography>
              <Button variant="contained" onClick={() => navigate('/create-item')}>
                Adicionar Primeiro Item
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {items.filter(item => item && item.title).map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <ItemCard
                    item={{
                      ...item,
                      category: item.category || 'livros',
                      location: item.location || 'Local n\u00E3o informado',
                      image: item.image_url_or_upload || item.image_url || getExampleImage(item.title, index),
                      condition: item.condition || 'Bom estado',
                      status: item.status || 'disponivel',
                    }}
                    onViewDetails={(it) => navigate(`/item/${it.id}`)}
                    onMakeOffer={(it) => navigate(`/item/${it.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
