import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ImageEditModal from '../components/ImageEditModal';

const MyItems = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, items, loadItems, deleteItem } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageEditModal, setImageEditModal] = useState({
    open: false,
    item: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated, loadItems]);

  // Filtrar apenas os itens do usuário atual
  const myItems = Array.isArray(items) ? items.filter(item => item.owner === user?.username) : [];

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
    setAnchorEl(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    setLoading(true);
    try {
      await deleteItem(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
    } catch (err) {
      setError('Erro ao excluir item');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEditItem = (item) => {
    navigate(`/edit-item/${item.id}`);
    handleMenuClose();
  };

  const handleViewItem = (item) => {
    navigate(`/item/${item.id}`);
    handleMenuClose();
  };

  const handleEditImage = (item) => {
    setImageEditModal({
      open: true,
      item: item,
    });
    handleMenuClose();
  };

  const handleCloseImageModal = () => {
    setImageEditModal({
      open: false,
      item: null,
    });
  };

  const handleSaveImage = async (itemId, imageData) => {
    try {
      // TODO: Implementar atualização da imagem via API
      console.log('Salvando imagem para item:', itemId, imageData);
      // Por enquanto, apenas recarregamos os itens
      await loadItems();
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      throw error;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'livros': <BookIcon />,
      'apostilas': <SchoolIcon />,
      'equipamentos': <ScienceIcon />,
      'tecnologia': <ComputerIcon />,
    };
    return icons[category] || <BookIcon />;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'livros': 'Livros',
      'apostilas': 'Apostilas',
      'equipamentos': 'Equipamentos',
      'tecnologia': 'Tecnologia',
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      'disponivel': 'success',
      'indisponível': 'error',
      'trocado': 'info',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'disponivel': 'Disponível',
      'indisponível': 'Indisponível',
      'trocado': 'Trocado',
    };
    return labels[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar seus itens.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Meus Itens ({myItems.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-item')}
        >
          Adicionar Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {myItems.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Você ainda não tem itens publicados
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Comece adicionando seu primeiro item para trocar com outros usuários!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-item')}
            >
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {myItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                      {getCategoryIcon(item.category)}
                      <Typography variant="subtitle2" sx={{ ml: 1 }}>
                        {getCategoryLabel(item.category)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, item)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2,
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={getStatusLabel(item.status)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewItem(item)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditItem(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(item)}
                    sx={{ ml: 'auto' }}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewItem(selectedItem)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Detalhes</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEditItem(selectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEditImage(selectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar Imagem</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedItem)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o item "{deleteDialog.item?.title}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição de Imagem */}
      <ImageEditModal
        open={imageEditModal.open}
        item={imageEditModal.item}
        onClose={handleCloseImageModal}
        onSave={handleSaveImage}
      />

      {/* FAB para adicionar item */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/create-item')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MyItems;
