import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ItemDetails from './pages/items/ItemDetails';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            {/* Adicionar mais rotas conforme necessário */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;