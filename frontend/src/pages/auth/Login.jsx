import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useApp();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const fromRegister = location.state?.fromRegister;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#f8fafc',
      }}
    >
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          color: '#fff',
        }}
      >
        <Typography variant="h2" sx={{ mb: 2, color: '#fff' }}>
          TrocaMat
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 400, lineHeight: 1.7 }}>
          Plataforma universitária para troca segura de materiais didáticos.
          Conecte-se com outros estudantes e compartilhe conhecimento.
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ display: { xs: 'block', md: 'none' }, mb: 3, fontWeight: 800, color: 'primary.main' }}
            >
              TrocaMat
            </Typography>
            <Typography variant="h3" gutterBottom sx={{ lineHeight: 1.3 }}>
              Entrar na sua conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acesse para trocar materiais didáticos
            </Typography>
          </Box>

          {fromRegister && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Cadastro realizado com sucesso! Faça login para continuar.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 4 }, borderColor: 'divider' }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Usuário"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 1 }}
                disabled={loading}
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta?{' '}
                  <Link component={RouterLink} to="/register" fontWeight={600}>
                    Cadastre-se
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
