import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import Header from './header';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              TrocaMat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A plataforma ideal para trocar seus materiais didáticos de forma
              segura e prática.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Para Usuários
            </Typography>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Como funciona
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Dicas de segurança
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Central de ajuda
            </Link>
            <Link href="#" variant="body2" display="block">
              Contato
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Categorias
            </Typography>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Livros
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Apostilas
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Equipamentos
            </Link>
            <Link href="#" variant="body2" display="block">
              Tecnologia
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Termos de uso
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Política de privacidade
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ mb: 1 }}>
              Política de cookies
            </Link>
            <Link href="#" variant="body2" display="block">
              Denunciar
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 TrocaMat. Todos os direitos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" variant="body2" color="text.secondary">
              Facebook
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Instagram
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Twitter
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Layout = ({ children, maxWidth = 'lg', disableGutters = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: disableGutters ? 0 : 3,
        }}
      >
        {maxWidth ? (
          <Container maxWidth={maxWidth} disableGutters={disableGutters}>
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;