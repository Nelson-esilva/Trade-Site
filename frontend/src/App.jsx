import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileProtection from './components/ProfileProtection';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ItemDetails from './pages/items/ItemDetails';
import CreateItem from './pages/items/CreateItem';
import Offers from './pages/offers/Offers';
// eslint-disable-next-line no-unused-vars
import Profile from './pages/Profile';
// eslint-disable-next-line no-unused-vars
import MyItems from './pages/MyItems';
// eslint-disable-next-line no-unused-vars
import MyOffers from './pages/MyOffers';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Routes>
            {/* Rotas de autenticação - sem Layout */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />
            
            {/* Rota padrão - redireciona para login se não autenticado */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rotas com Layout - todas protegidas */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  {/* Rotas protegidas - requerem autenticação */}
                  <Route path="/item/:id" element={
                    <ProtectedRoute>
                      <ItemDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-item" element={
                    <ProtectedRoute>
                      <CreateItem />
                    </ProtectedRoute>
                  } />
                  <Route path="/offers" element={
                    <ProtectedRoute>
                      <Offers />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-items" element={
                    <ProtectedRoute>
                      <MyItems />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-offers" element={
                    <ProtectedRoute>
                      <MyOffers />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rota para perfil específico com proteção adicional */}
                  <Route path="/profile/:username" element={
                    <ProtectedRoute>
                      <ProfileProtection>
                        <Profile />
                      </ProfileProtection>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;