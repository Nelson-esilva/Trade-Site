import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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
  const { user, isAuthenticated, logout, offers } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Contar ofertas pendentes
  const pendingOffersCount = offers.filter(offer => offer.status === 'pendente').length;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
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
      <MenuItem onClick={() => { navigate('/offers'); handleMenuClose(); }}>
        Minhas Ofertas
      </MenuItem>
      <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
        Configurações
      </MenuItem>
      <MenuItem onClick={handleLogout}>Sair</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            cursor: 'pointer',
            fontWeight: 'bold',
            flexGrow: { xs: 1, sm: 0 },
            mr: { sm: 4 },
            color: 'white',
          }}
          onClick={() => navigate('/')}
        >
          TrocaMat
        </Typography>

        {/* Search Bar - Desktop */}
        <Search sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1, maxWidth: 400 }}>
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
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-item')}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Anunciar
              </Button>
              
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
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
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

      {renderMenu}
    </AppBar>
  );
};

export default Header;