import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ItemDetails from './pages/items/ItemDetails';
import CreateItem from './pages/items/CreateItem';
import Offers from './pages/offers/Offers';
import Profile from './pages/Profile';
import MyItems from './pages/MyItems';
import MyOffers from './pages/MyOffers';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-items" element={<MyItems />} />
              <Route path="/my-offers" element={<MyOffers />} />
              {/* Adicionar mais rotas conforme necessário */}
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;