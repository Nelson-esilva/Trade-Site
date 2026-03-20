import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import Header from './header';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: '#0f172a',
      color: 'rgba(255,255,255,0.7)',
      mt: 'auto',
    }}
  >
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            TrocaMat
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 320, lineHeight: 1.7 }}>
            Plataforma universitária para troca segura de materiais didáticos entre estudantes.
          </Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 1.5 }}>
            Navegação
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Meus Itens', href: '/my-items' },
              { label: 'Ofertas', href: '/my-offers' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>

        <Grid item xs={6} md={4}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 1.5 }}>
            Conta
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: 'Perfil', href: '/profile' },
              { label: 'Criar Item', href: '/create-item' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} TrocaMat. Todos os direitos reservados.
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
          Feito para facilitar trocas entre estudantes
        </Typography>
      </Box>
    </Container>
  </Box>
);

const Layout = ({ children, themeMode, onToggleTheme }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header themeMode={themeMode} onToggleTheme={onToggleTheme} />
    <Box component="main" sx={{ flexGrow: 1 }}>
      {children}
    </Box>
    <Footer />
  </Box>
);

export default Layout;
