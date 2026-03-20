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

const categoryIcons = {
  livros: <BookIcon sx={{ fontSize: 18 }} />,
  apostilas: <SchoolIcon sx={{ fontSize: 18 }} />,
  equipamentos: <ScienceIcon sx={{ fontSize: 18 }} />,
  tecnologia: <ComputerIcon sx={{ fontSize: 18 }} />,
};

const categoryLabels = {
  livros: 'Livros',
  apostilas: 'Apostilas',
  equipamentos: 'Equipamentos',
  tecnologia: 'Tecnologia',
};

const statusMap = {
  disponivel: { label: 'Disponível', color: 'success' },
  'indisponível': { label: 'Indisponível', color: 'error' },
  trocado: { label: 'Trocado', color: 'info' },
};

const MyItems = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, items, loadItems, deleteItem, updateItem } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageEditModal, setImageEditModal] = useState({ open: false, item: null });

  useEffect(() => {
    if (isAuthenticated) loadItems();
  }, [isAuthenticated, loadItems]);

  const myItems = Array.isArray(items)
    ? (user?.is_superuser ? items : items.filter(item => item.owner === user?.username))
    : [];

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

  const handleSaveImage = async (itemId, imageData) => {
    try {
      await updateItem(itemId, imageData);
      setImageEditModal({ open: false, item: null });
    } catch (err) {
      console.error('Erro ao salvar imagem:', err);
      throw err;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning">Você precisa estar logado para acessar seus itens.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Gerenciamento
          </Typography>
          <Typography variant="h3">
            {user?.is_superuser ? 'Todos os Itens' : 'Meus Itens'}
            <Typography component="span" variant="h3" color="text.secondary" sx={{ ml: 1 }}>
              ({myItems.length})
            </Typography>
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-item')}>
          Adicionar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {myItems.length === 0 ? (
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
            Nenhum item publicado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comece adicionando seu primeiro item para trocar com outros usuários!
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-item')}>
            Adicionar Primeiro Item
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myItems.map((item) => {
            const status = statusMap[item.status] || { label: item.status, color: 'default' };
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {categoryIcons[item.category] || <BookIcon sx={{ fontSize: 18 }} />}
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {categoryLabels[item.category] || item.category}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedItem(item); }}>
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.7em',
                        lineHeight: 1.35,
                      }}
                    >
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
                        minHeight: '2.7em',
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button size="small" startIcon={<ViewIcon sx={{ fontSize: 16 }} />} onClick={() => navigate(`/item/${item.id}`)} sx={{ color: 'text.secondary' }}>
                      Ver
                    </Button>
                    <Button size="small" startIcon={<EditIcon sx={{ fontSize: 16 }} />} onClick={() => navigate(`/edit-item/${item.id}`)}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                      onClick={() => { setDeleteDialog({ open: true, item }); setAnchorEl(null); }}
                      sx={{ ml: 'auto' }}
                    >
                      Excluir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Context menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null); setSelectedItem(null); }}>
        <MenuItem onClick={() => { navigate(`/item/${selectedItem?.id}`); setAnchorEl(null); }}>
          <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver Detalhes</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/edit-item/${selectedItem?.id}`); setAnchorEl(null); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setImageEditModal({ open: true, item: selectedItem }); setAnchorEl(null); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar Imagem</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialog({ open: true, item: selectedItem }); setAnchorEl(null); }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o item &ldquo;{deleteDialog.item?.title}&rdquo;?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {loading ? 'Excluindo…' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      <ImageEditModal
        open={imageEditModal.open}
        item={imageEditModal.item}
        onClose={() => setImageEditModal({ open: false, item: null })}
        onSave={handleSaveImage}
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => navigate('/create-item')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MyItems;
