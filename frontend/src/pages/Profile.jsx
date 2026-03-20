import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory2 as ItemsIcon,
  SwapHoriz as OffersIcon,
  CheckCircle as TradesIcon,
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useApp();
  const [editDialog, setEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, isAuthenticated]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    try {
      await updateProfile(formData);
      setEditDialog(false);
    } catch (err) {
      setError('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      name: user.name || '',
      email: user.email || '',
    });
    setEditDialog(false);
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning">Você precisa estar logado para acessar seu perfil.</Alert>
      </Container>
    );
  }

  const stats = [
    { label: 'Itens Publicados', value: 0, icon: <ItemsIcon />, color: 'primary.main' },
    { label: 'Ofertas Recebidas', value: 0, icon: <OffersIcon />, color: 'warning.main' },
    { label: 'Trocas Realizadas', value: 0, icon: <TradesIcon />, color: 'success.main' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Conta
      </Typography>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Meu Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Profile card */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'divider' }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
              }}
            >
              {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {user?.name || user?.username || 'Usuário'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              @{user?.username}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDialog(true)}
              size="small"
              fullWidth
            >
              Editar Perfil
            </Button>
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 4, borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Informações Pessoais
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <PersonIcon sx={{ color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nome de usuário</Typography>
                    <Typography variant="body1">{user?.username || 'Não informado'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <EmailIcon sx={{ color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{user?.email || 'Não informado'}</Typography>
                  </Box>
                </Box>
              </Grid>
              {user?.first_name && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <PersonIcon sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Primeiro Nome</Typography>
                      <Typography variant="body1">{user.first_name}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {user?.last_name && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <PersonIcon sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Sobrenome</Typography>
                      <Typography variant="body1">{user.last_name}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card sx={{ '&:hover': { transform: 'none' } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                <Box sx={{ color: stat.color, display: 'flex' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit dialog */}
      <Dialog open={editDialog} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Editar Perfil</Typography>
          <IconButton onClick={handleCancelEdit} size="small">
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Primeiro Nome" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Sobrenome" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nome" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelEdit} disabled={loading}>Cancelar</Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
