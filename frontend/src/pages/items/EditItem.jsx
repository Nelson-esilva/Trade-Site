import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadItem, currentItem, updateItem, loading, error, clearError } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'livros',
    location: '',
    image_url: '',
    status: 'disponivel',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) loadItem(id);
  }, [id, loadItem]);

  useEffect(() => {
    if (currentItem && String(currentItem.id) === String(id)) {
      setFormData({
        title: currentItem.title || '',
        description: currentItem.description || '',
        category: currentItem.category || 'livros',
        location: currentItem.location || '',
        image_url: currentItem.image_url || '',
        status: currentItem.status || 'disponivel',
      });
    }
  }, [currentItem, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Título é obrigatório';
    if (!formData.description.trim()) errors.description = 'Descrição é obrigatória';
    if (!formData.location.trim()) errors.location = 'Localização é obrigatória';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await updateItem(id, formData);
      navigate('/my-items');
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/my-items')} sx={{ mb: 3, color: 'text.secondary' }}>
        Voltar
      </Button>

      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Edição
      </Typography>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Editar Item
      </Typography>

      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>{error}</Alert>}

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderColor: 'divider' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required fullWidth name="title" label="Título do Item"
                value={formData.title} onChange={handleChange}
                error={!!formErrors.title} helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth multiline rows={4} name="description" label="Descrição"
                value={formData.description} onChange={handleChange}
                error={!!formErrors.description} helperText={formErrors.description}
              />
            </Grid>
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
              <TextField
                required fullWidth name="location" label="Cidade/Estado"
                value={formData.location} onChange={handleChange}
                error={!!formErrors.location} helperText={formErrors.location}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="image_url" label="URL da imagem"
                value={formData.image_url} onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                  <MenuItem value="disponivel">Disponível</MenuItem>
                  <MenuItem value="indisponível">Indisponível</MenuItem>
                  <MenuItem value="trocado">Trocado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/my-items')} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit" variant="contained"
              startIcon={loading ? <CircularProgress size={18} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Salvando…' : 'Salvar Alterações'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditItem;
