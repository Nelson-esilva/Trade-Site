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
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
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

  const labelSx = {
    fontSize: '0.86rem',
    fontWeight: 700,
    mb: 0.8,
    color: '#0f172a',
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
    },
  };

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3, color: 'text.secondary' }}>
        Voltar
      </Button>

      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
        Adicionar Novo Item
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Compartilhe seus materiais didáticos com outros estudantes
      </Typography>

      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>{error}</Alert>}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderColor: '#d1d5db',
          bgcolor: '#eceff1',
          borderRadius: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography sx={labelSx}>Título *</Typography>
              <TextField
                required
                fullWidth
                size="small"
                name="title"
                value={formData.title} onChange={handleChange}
                error={!!formErrors.title} helperText={formErrors.title}
                placeholder="Ex: Troca de filtro, Reparo na esteira..."
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={labelSx}>Descrição</Typography>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description} onChange={handleChange}
                error={!!formErrors.description} helperText={formErrors.description}
                placeholder="Descreva o item (opcional)"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={labelSx}>Categoria</Typography>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Selecione</InputLabel>
                <Select name="category" value={formData.category} label="Selecione" onChange={handleChange}>
                  <MenuItem value="livros">Livros</MenuItem>
                  <MenuItem value="apostilas">Apostilas</MenuItem>
                  <MenuItem value="equipamentos">Equipamentos</MenuItem>
                  <MenuItem value="tecnologia">Tecnologia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={labelSx}>Cidade/Estado *</Typography>
              <TextField
                required
                fullWidth
                size="small"
                name="location"
                value={formData.location} onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location || ' '}
                placeholder="Ex: São Paulo, SP"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={labelSx}>Status</Typography>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Selecione</InputLabel>
                <Select name="status" value={formData.status} label="Selecione" onChange={handleChange}>
                  <MenuItem value="disponivel">Disponível</MenuItem>
                  <MenuItem value="indisponível">Indisponível</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Image upload */}
            <Grid item xs={12}>
              <Typography sx={labelSx}>Imagem do Produto</Typography>
              {imagePreview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12, objectFit: 'cover' }}
                  />
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    color="error" size="small" sx={{ mt: 1 }}
                  >
                    Remover
                  </Button>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <input accept="image/*" style={{ display: 'none' }} id="image-upload" type="file" onChange={handleImageChange} />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" startIcon={<UploadIcon />} fullWidth sx={{ py: 1.1, bgcolor: '#fff' }}>
                    {selectedImage ? 'Trocar Imagem' : 'Selecionar Imagem'}
                  </Button>
                </label>
              </Box>
              <TextField
                fullWidth size="small" name="image_url" label="URL da imagem"
                value={formData.image_url} onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={!!selectedImage}
                helperText="Alternativa ao upload de arquivo"
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ bgcolor: '#f8fafc', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  Dicas para uma boa descrição
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.8 }}>
                  &bull; Mencione a condição do item (novo, usado, etc.)<br/>
                  &bull; Inclua informações sobre o uso (semestre, ano)<br/>
                  &bull; Descreva se há anotações ou marcações<br/>
                  &bull; Mencione se há acessórios incluídos
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/')} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit" variant="contained"
              startIcon={loading ? <CircularProgress size={18} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Salvando…' : 'Salvar Item'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateItem;
