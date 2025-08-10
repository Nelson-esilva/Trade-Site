import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para demonstração
  const featuredItems = [
    {
      id: 1,
      title: 'Livro de Cálculo I - Stewart',
      description: 'Livro em ótimo estado, usado apenas um semestre',
      category: 'Livros',
      location: 'São Paulo, SP',
      image: '/api/placeholder/300/200',
      offers: 3,
    },
    {
      id: 2,
      title: 'Kit Microscópio Escolar',
      description: 'Microscópio com acessórios completos para estudos',
      category: 'Equipamentos',
      location: 'Rio de Janeiro, RJ',
      image: '/api/placeholder/300/200',
      offers: 1,
    },
    {
      id: 3,
      title: 'Apostila Curso de Programação',
      description: 'Material completo de curso de desenvolvimento web',
      category: 'Apostilas',
      location: 'Belo Horizonte, MG',
      image: '/api/placeholder/300/200',
      offers: 5,
    },
  ];

  const categories = [
    { name: 'Livros', icon: <BookIcon fontSize="large" />, count: 1250 },
    { name: 'Apostilas', icon: <SchoolIcon fontSize="large" />, count: 890 },
    { name: 'Equipamentos', icon: <ScienceIcon fontSize="large" />, count: 340 },
    { name: 'Tecnologia', icon: <ComputerIcon fontSize="large" />, count: 567 },
  ];

  const handleSearch = () => {
    console.log('Buscar por:', searchTerm);
    // Implementar lógica de busca
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            >
              Buscar
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

      {/* Featured Items */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Itens em Destaque
        </Typography>
        <Grid container spacing={3}>
          {featuredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {item.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip label={item.category} size="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {item.offers} ofertas
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" color="text.secondary">
                    <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{item.location}</Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Detalhes
                  </Button>
                  <Button size="small" color="secondary">
                    Fazer Oferta
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;