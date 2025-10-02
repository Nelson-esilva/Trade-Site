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
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Limpar URL de imagem se um arquivo foi selecionado
      setFormData({
        ...formData,
        image_url: '',
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Título deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Criar FormData para enviar arquivo
      const submitData = new FormData();
      
      // Adicionar campos do formulário
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Adicionar arquivo de imagem se selecionado
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }
      
      await createItem(submitData);
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
          <Typography component="h1" variant="h4" gutterBottom>
            Adicionar Novo Item
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compartilhe seus materiais didáticos com outros estudantes
          </Typography>
        </Box>

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

        {/* Form */}
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Título */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Título do Item"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  placeholder="Ex: Livro de Cálculo I - Stewart"
                />
              </Grid>

              {/* Descrição */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  placeholder="Descreva o item, sua condição, como foi usado, etc."
                />
              </Grid>

              {/* Categoria */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Categoria</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formData.category}
                    label="Categoria"
                    onChange={handleChange}
                  >
                    <MenuItem value="livros">Livros</MenuItem>
                    <MenuItem value="apostilas">Apostilas</MenuItem>
                    <MenuItem value="equipamentos">Equipamentos</MenuItem>
                    <MenuItem value="tecnologia">Tecnologia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Localização */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="location"
                  label="Cidade/Estado"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  placeholder="Ex: São Paulo, SP"
                />
              </Grid>


              {/* Upload de Imagem */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Imagem do Produto
                </Typography>
                
                {/* Preview da Imagem */}
                {imagePreview && (
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Remover Imagem
                    </Button>
                  </Box>
                )}
                
                {/* Upload de Arquivo */}
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
                      sx={{ py: 2 }}
                    >
                      {selectedImage ? 'Trocar Imagem' : 'Selecionar Imagem do Computador'}
                    </Button>
                  </label>
                </Box>
                
                {/* URL da Imagem (alternativa) */}
                <TextField
                  fullWidth
                  id="image_url"
                  label="Ou cole uma URL de imagem (opcional)"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  error={!!formErrors.image_url}
                  helperText={formErrors.image_url || "Alternativa: cole aqui o link de uma imagem"}
                  placeholder="https://exemplo.com/imagem.jpg"
                  disabled={!!selectedImage}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="disponivel">Disponível</MenuItem>
                    <MenuItem value="indisponível">Indisponível</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Informações Adicionais */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    💡 Dicas para uma boa descrição:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Mencione a condição do item (novo, usado, etc.)<br/>
                    • Inclua informações sobre o uso (semestre, ano)<br/>
                    • Descreva se há anotações ou marcações<br/>
                    • Mencione se há acessórios incluídos
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Botões */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Item'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateItem;
