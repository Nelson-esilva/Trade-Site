import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const ImageEditModal = ({ open, onClose, item, onSave }) => {
  const [imageUrl, setImageUrl] = useState(item?.image || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      setError('Por favor, insira uma URL de imagem válida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validar se a URL é uma imagem válida
      const img = new Image();
      img.onload = async () => {
        try {
          await onSave(item.id, { image: imageUrl });
          onClose();
        } catch (err) {
          setError('Erro ao salvar a imagem');
        } finally {
          setLoading(false);
        }
      };
      img.onerror = () => {
        setError('URL de imagem inválida');
        setLoading(false);
      };
      img.src = imageUrl;
    } catch (err) {
      setError('Erro ao validar a imagem');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImageUrl(item?.image || '');
    setError('');
    onClose();
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
    setError('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <ImageIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Editar Imagem - {item?.title}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Insira a URL de uma imagem para o item. Você pode usar imagens do Unsplash, 
            Imgur, ou qualquer outro serviço de hospedagem de imagens.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="URL da Imagem"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://exemplo.com/imagem.jpg"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          {/* Preview da imagem */}
          {imageUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Preview:
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Box
                  sx={{
                    display: 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body2">
                    Imagem não encontrada
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Sugestões de URLs */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Sugestões de imagens:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[
                { label: 'Livro', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
                { label: 'Programação', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
                { label: 'Equipamento', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop' },
                { label: 'Tecnologia', url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop' },
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  size="small"
                  variant="outlined"
                  onClick={() => setImageUrl(suggestion.url)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {suggestion.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !imageUrl.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : <UploadIcon />}
        >
          {loading ? 'Salvando...' : 'Salvar Imagem'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageEditModal;
