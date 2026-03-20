import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  SwapHoriz as SwapIcon,
  Home as HomeIcon,
  Inventory2 as InventoryIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, offers } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingOffersCount = offers.filter(offer => offer.status === 'pendente').length;

  const navItems = useMemo(() => ([
    { label: 'Explorar', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Criar Item', path: '/create-item', icon: <AddIcon fontSize="small" /> },
    { label: 'Meus Itens', path: '/my-items', icon: <InventoryIcon fontSize="small" /> },
    { label: 'Ofertas', path: '/my-offers', icon: <SwapIcon fontSize="small" /> },
    { label: 'Perfil', path: '/profile', icon: <AccountCircleIcon fontSize="small" /> },
  ]), []);

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              mr: 3,
              flexShrink: 0,
            }}
          >
            TrocaMat
          </Typography>

          {/* Search */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.08)',
              borderRadius: 2.5,
              px: 1.5,
              py: 0.5,
              flexGrow: 1,
              maxWidth: 400,
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'border-color 0.15s',
              '&:focus-within': {
                borderColor: 'rgba(255,255,255,0.2)',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, mr: 1 }} />
            <InputBase
              placeholder="Buscar materiais\u2026"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              sx={{
                color: '#fff',
                flex: 1,
                fontSize: '0.85rem',
                '& ::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.25 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  size="small"
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.82rem',
                    fontWeight: isActivePath(item.path) ? 600 : 400,
                    color: isActivePath(item.path) ? '#fff' : 'rgba(255,255,255,0.65)',
                    bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right actions */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => navigate('/offers')}
                sx={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <Badge badgeContent={pendingOffersCount} color="error">
                  <SwapIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: 0.5 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563eb', fontSize: '0.85rem' }}>
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')} sx={{ fontSize: '0.85rem' }}>
                Entrar
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ fontSize: '0.85rem' }}
              >
                Cadastrar
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile search */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, px: 2, pb: 1.5, alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            flex: 1,
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, mr: 1 }} />
          <InputBase
            placeholder="Buscar\u2026"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            sx={{
              color: '#fff',
              flex: 1,
              fontSize: '0.85rem',
              '& ::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
            }}
          />
        </Box>
      </Box>

      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 180, borderRadius: 3, border: '1px solid', borderColor: 'divider' },
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={() => { navigate('/my-items'); setAnchorEl(null); }}>
          Meus Itens
        </MenuItem>
        <MenuItem onClick={() => { navigate('/my-offers'); setAnchorEl(null); }}>
          Minhas Ofertas
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          Sair
        </MenuItem>
      </Menu>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: '#fff' } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            TrocaMat
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActivePath(item.path)}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.25,
                '&.Mui-selected': { bgcolor: 'rgba(37, 99, 235, 0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isActivePath(item.path) ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          ))}
        </List>
        {isAuthenticated && (
          <>
            <Divider sx={{ mx: 2 }} />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
                size="small"
              >
                Sair
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Header;
