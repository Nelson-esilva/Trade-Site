// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Classe para gerenciar requisições HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para obter o token de autenticação
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Método para definir o token de autenticação
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Se a resposta não tem conteúdo, retorna null
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos GET
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // Métodos POST
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos PUT
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Métodos PATCH
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Métodos DELETE
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ===== SERVIÇOS ESPECÍFICOS =====

  // === AUTENTICAÇÃO ===
  async login(username, password) {
    const response = await this.post('/auth/login/', { username, password });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    this.setAuthToken(null);
  }

  async registerUser(userData) {
    const response = await this.post('/auth/register/', userData);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  // === USUÁRIOS ===
  async getUsers() {
    return this.get('/users/');
  }

  async getUser(id) {
    return this.get(`/users/${id}/`);
  }

  async getCurrentUser() {
    return this.get('/users/me/');
  }

  // === ITENS ===
  async getItems() {
    return this.get('/items/');
  }

  async getItem(id) {
    return this.get(`/items/${id}/`);
  }

  async createItem(itemData) {
    return this.post('/items/', itemData);
  }

  async updateItem(id, itemData) {
    return this.put(`/items/${id}/`, itemData);
  }

  async deleteItem(id) {
    return this.delete(`/items/${id}/`);
  }

  async changeItemStatus(id, status) {
    return this.patch(`/items/${id}/change_status/`, { status });
  }

  // === OFERTAS ===
  async getOffers() {
    return this.get('/offers/');
  }

  async getOffer(id) {
    return this.get(`/offers/${id}/`);
  }

  async createOffer(offerData) {
    return this.post('/offers/', offerData);
  }

  async updateOffer(id, offerData) {
    return this.put(`/offers/${id}/`, offerData);
  }

  async deleteOffer(id) {
    return this.delete(`/offers/${id}/`);
  }

  async acceptOffer(id) {
    return this.post(`/offers/${id}/accept/`);
  }

  async refuseOffer(id) {
    return this.post(`/offers/${id}/refuse/`);
  }

  // === BUSCA E FILTROS ===
  async searchItems(query, filters = {}) {
    const params = new URLSearchParams();
    
    if (query) params.append('search', query);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.location) params.append('location', filters.location);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/items/?${queryString}` : '/items/';
    
    return this.get(endpoint);
  }
}

// Instância única do serviço
const apiService = new ApiService();

export default apiService;
