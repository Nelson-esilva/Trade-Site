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
    if (!formData.title.trim()) errors.title = 'T\u00EDtulo \u00E9 obrigat\u00F3rio';
    else if (formData.title.trim().length < 3) errors.title = 'M\u00EDnimo 3 caracteres';
    if (!formData.description.trim()) errors.description = 'Descri\u00E7\u00E3o \u00E9 obrigat\u00F3ria';
    else if (formData.description.trim().length < 10) errors.description = 'M\u00EDnimo 10 caracteres';
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
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3, color: 'text.secondary' }}>
        Voltar
      </Button>

      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Publicar
      </Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Adicionar Novo Item
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Compartilhe seus materiais did\u00E1ticos com outros estudantes
      </Typography>

      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>{error}</Alert>}

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderColor: 'divider' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required fullWidth name="title" label="T\u00EDtulo do Item"
                value={formData.title} onChange={handleChange}
                error={!!formErrors.title} helperText={formErrors.title}
                placeholder="Ex: Livro de C\u00E1lculo I - Stewart"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required fullWidth multiline rows={4} name="description" label="Descri\u00E7\u00E3o"
                value={formData.description} onChange={handleChange}
                error={!!formErrors.description} helperText={formErrors.description}
                placeholder="Descreva o item, sua condi\u00E7\u00E3o, como foi usado, etc."
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
                placeholder="Ex: S\u00E3o Paulo, SP"
              />
            </Grid>

            {/* Image upload */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1.5, fontSize: '0.95rem' }}>Imagem do Produto</Typography>
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
                  <Button variant="outlined" component="span" startIcon={<UploadIcon />} fullWidth sx={{ py: 1.5 }}>
                    {selectedImage ? 'Trocar Imagem' : 'Selecionar Imagem'}
                  </Button>
                </label>
              </Box>
              <TextField
                fullWidth name="image_url" label="Ou cole uma URL de imagem"
                value={formData.image_url} onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={!!selectedImage}
                helperText="Alternativa ao upload de arquivo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                  <MenuItem value="disponivel">Dispon\u00EDvel</MenuItem>
                  <MenuItem value="indispon\u00EDvel">Indispon\u00EDvel</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ bgcolor: '#f8fafc', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  Dicas para uma boa descri\u00E7\u00E3o
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.8 }}>
                  &bull; Mencione a condi\u00E7\u00E3o do item (novo, usado, etc.)<br/>
                  &bull; Inclua informa\u00E7\u00F5es sobre o uso (semestre, ano)<br/>
                  &bull; Descreva se h\u00E1 anota\u00E7\u00F5es ou marca\u00E7\u00F5es<br/>
                  &bull; Mencione se h\u00E1 acess\u00F3rios inclu\u00EDdos
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
              {loading ? 'Salvando\u2026' : 'Salvar Item'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateItem;
