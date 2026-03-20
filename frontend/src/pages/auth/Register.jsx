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
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, loading, error, clearError } = useApp();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Nome de usu\u00E1rio \u00E9 obrigat\u00F3rio';
    else if (formData.username.trim().length < 3) errors.username = 'M\u00EDnimo 3 caracteres';
    if (!formData.name.trim()) errors.name = 'Nome completo \u00E9 obrigat\u00F3rio';
    if (!formData.email.trim()) errors.email = 'Email \u00E9 obrigat\u00F3rio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inv\u00E1lido';
    if (!formData.password) errors.password = 'Senha \u00E9 obrigat\u00F3ria';
    else if (formData.password.length < 6) errors.password = 'M\u00EDnimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'As senhas n\u00E3o coincidem';
    if (!formData.acceptTerms) errors.acceptTerms = 'Voc\u00EA deve aceitar os termos';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate('/login', { state: { fromRegister: true } });
    } catch (err) {
      console.error('Erro ao registrar:', err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>
      {/* Left branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '40%',
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
          Junte-se \u00E0 comunidade de troca de materiais did\u00E1ticos.
          Cadastre-se e comece a compartilhar com outros estudantes.
        </Typography>
      </Box>

      {/* Right form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 5 } }}>
        <Container maxWidth="sm" disableGutters>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ display: { xs: 'block', md: 'none' }, mb: 2, fontWeight: 800, color: 'primary.main' }}
            >
              TrocaMat
            </Typography>
            <Typography variant="h3" gutterBottom>
              Criar nova conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha os dados para se juntar \u00E0 plataforma
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderColor: 'divider' }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="username"
                    label="Nome de Usu\u00E1rio"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Nome Completo"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color={formErrors.acceptTerms ? 'error' : 'text.secondary'}>
                        Eu aceito os{' '}
                        <Link href="#" underline="hover" fontWeight={600}>Termos de Uso</Link>
                        {' '}e a{' '}
                        <Link href="#" underline="hover" fontWeight={600}>Pol\u00EDtica de Privacidade</Link>
                      </Typography>
                    }
                  />
                  {formErrors.acceptTerms && (
                    <Typography variant="caption" color="error">
                      {formErrors.acceptTerms}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 1 }}
                disabled={loading}
              >
                {loading ? 'Criando conta\u2026' : 'Criar Conta'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  J\u00E1 tem uma conta?{' '}
                  <Link component={RouterLink} to="/login" fontWeight={600}>
                    Fa\u00E7a login
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

export default Register;
