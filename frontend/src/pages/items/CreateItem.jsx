import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  AddBox as AddBoxIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const CreateItem = () => {
  const navigate = useNavigate();
  const { createItem, loading, error, clearError } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'livros',
    location: '',
    image_url: '',
    status: 'disponivel',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, image_url: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Título é obrigatório';
    else if (formData.title.trim().length < 3) errors.title = 'Mínimo 3 caracteres';
    if (!formData.description.trim()) errors.description = 'Descrição é obrigatória';
    else if (formData.description.trim().length < 10) errors.description = 'Mínimo 10 caracteres';
    if (!formData.location.trim()) errors.location = 'Cidade/Estado é obrigatório';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) submitData.append(key, formData[key]);
      });
      if (selectedImage) submitData.append('image', selectedImage);
      await createItem(submitData);
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar item:', err);
    }
  };

  return (
    <Box sx={{ bgcolor: '#e8eef4', minHeight: '100vh' }}>
      {/* Cabeçalho destacado */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
          color: '#fff',
          py: { xs: 4, md: 5 },
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2, color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Voltar
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <AddBoxIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
              Novo Item
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Preencha as informações do material que deseja disponibilizar para troca.
          </Typography>
        </Container>
      </Box>

      {/* Formulário */}
      <Container maxWidth="sm" sx={{ mt: -3, pb: 6 }}>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {/* Informações básicas */}
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 2, display: 'block' }}>
              Informações básicas
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <TextField
                required
                fullWidth
                name="title"
                label="Título do Item"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                placeholder="Ex: Livro de Cálculo I - Stewart, 8ª edição"
              />

              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Descrição"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description || 'Descreva a condição, uso e detalhes relevantes do item.'}
                placeholder="Ex: Livro em bom estado, sem anotações, capa íntegra..."
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Classificação */}
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 2, display: 'block' }}>
              Classificação e localização
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select name="category" value={formData.category} label="Categoria" onChange={handleChange}>
                      <MenuItem value="livros">Livros</MenuItem>
                      <MenuItem value="apostilas">Apostilas</MenuItem>
                      <MenuItem value="equipamentos">Equipamentos</MenuItem>
                      <MenuItem value="tecnologia">Tecnologia</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                      <MenuItem value="disponivel">Disponível</MenuItem>
                      <MenuItem value="indisponível">Indisponível</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                required
                fullWidth
                name="location"
                label="Cidade / Estado"
                value={formData.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                placeholder="São Paulo, SP"
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Imagem */}
            <Typography variant="overline" sx={{ color: 'primary.main', mb: 2, display: 'block' }}>
              Imagem do produto
            </Typography>

            <Box sx={{ mb: 4 }}>
              {imagePreview && (
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 240,
                      borderRadius: 2,
                      objectFit: 'cover',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    color="error"
                    size="small"
                    sx={{ mt: 1.5 }}
                  >
                    Remover imagem
                  </Button>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 1.75 }}
                  >
                    {selectedImage ? 'Trocar Imagem' : 'Upload do computador'}
                  </Button>
                </label>
              </Box>

              <TextField
                fullWidth
                name="image_url"
                label="Ou cole uma URL da imagem"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={!!selectedImage}
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Dicas */}
            <Box sx={{ bgcolor: '#f0f7ff', p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'rgba(37,99,235,0.15)', mb: 4 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: 'primary.dark' }}>
                Dicas para um bom anúncio
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>
                • Mencione a condição do item (novo, seminovo, usado)<br />
                • Inclua informações sobre uso (semestre, ano, disciplina)<br />
                • Descreva se há anotações, marcações ou defeitos<br />
                • Mencione se há acessórios incluídos
              </Typography>
            </Box>

            {/* Ações */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
                sx={{ px: 5, py: 1.2 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} /> : <SaveIcon />}
                disabled={loading}
                sx={{ px: 5, py: 1.2 }}
              >
                {loading ? 'Publicando…' : 'Publicar Item'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateItem;
