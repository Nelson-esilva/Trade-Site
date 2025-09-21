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
    status: 'disponivel',
  });
  
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
      await createItem(formData);
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
