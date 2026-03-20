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
  alpha,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  SwapHoriz as SwapIcon,
  Home as HomeIcon,
  Inventory2 as InventoryIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, offers } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Contar ofertas pendentes
  const pendingOffersCount = offers.filter(offer => offer.status === 'pendente').length;
  const navItems = useMemo(() => ([
    { label: 'Explorar', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Criar Item', path: '/create-item', icon: <AddIcon fontSize="small" /> },
    { label: 'Meus Itens', path: '/my-items', icon: <InventoryIcon fontSize="small" /> },
    { label: 'Ofertas', path: '/my-offers', icon: <SwapIcon fontSize="small" /> },
    { label: 'Perfil', path: '/profile', icon: <AccountCircleIcon fontSize="small" /> },
  ]), []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        Meu Perfil
      </MenuItem>
      <MenuItem onClick={() => { navigate('/my-items'); handleMenuClose(); }}>
        Meus Itens
      </MenuItem>
      <MenuItem onClick={() => { navigate('/my-offers'); handleMenuClose(); }}>
        Minhas Ofertas
      </MenuItem>
      <MenuItem onClick={handleLogout}>Sair</MenuItem>
    </Menu>
  );

  const mobileDrawer = (
    <Box sx={{ width: 280, py: 1 }}>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>
          TrocaMat
        </Typography>
      </Box>
      <Divider />
      <List sx={{ py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActivePath(item.path)}
            onClick={() => handleNavigate(item.path)}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            cursor: 'pointer',
            fontWeight: 'bold',
            flexGrow: { xs: 1, sm: 0 },
            mr: { sm: 3 },
            color: 'white',
          }}
          onClick={() => navigate('/')}
        >
          TrocaMat
        </Typography>

        {/* Search Bar - Desktop */}
        <Search
          sx={{
            display: { xs: 'none', sm: 'block' },
            flexGrow: 1,
            maxWidth: 360,
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          <SearchIconWrapper>
            <SearchIcon sx={{ color: 'white' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Buscar materiais..."
            inputProps={{ 'aria-label': 'search' }}
            sx={{ color: 'white' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    px: 1.4,
                    color: 'white',
                    borderRadius: 2,
                    bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                sx={{ color: 'white' }}
                onClick={() => navigate('/offers')}
              >
                <Badge badgeContent={pendingOffersCount} color="error">
                  <SwapIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ color: 'white' }}
              >
                <Avatar
                  sx={{ width: 32, height: 32, backgroundColor: 'secondary.main' }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: 'white' }}>
                Entrar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/register')}
                sx={{ ml: 1, color: 'white', borderColor: 'white' }}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu */}
      </Toolbar>

      {/* Search Bar - Mobile */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 1, backgroundColor: 'primary.main' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: 'white' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Buscar materiais..."
            inputProps={{ 'aria-label': 'search' }}
            fullWidth
            sx={{ color: 'white' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </Search>
      </Box>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { backgroundColor: 'background.default' } }}
      >
        {mobileDrawer}
      </Drawer>

      {renderMenu}
    </AppBar>
  );
};

export default Header;