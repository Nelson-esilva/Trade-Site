import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import Header from './header';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0f172a',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              TrocaMat
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
              Plataforma universitária para troca segura de materiais didáticos.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Link href="/" variant="body2" sx={{ color: 'rgba(255,255,255,0.86)' }}>
                Início
              </Link>
              <Link href="/my-items" variant="body2" sx={{ color: 'rgba(255,255,255,0.86)' }}>
                Meus Itens
              </Link>
              <Link href="/my-offers" variant="body2" sx={{ color: 'rgba(255,255,255,0.86)' }}>
                Ofertas
              </Link>
              <Link href="/profile" variant="body2" sx={{ color: 'rgba(255,255,255,0.86)' }}>
                Perfil
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.14)' }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            © 2026 TrocaMat. Todos os direitos reservados.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
            Feito para facilitar trocas entre estudantes.
          </Typography>
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
          py: disableGutters ? 0 : 4,
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