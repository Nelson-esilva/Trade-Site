// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Classe para gerenciar requisições HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  // Método para obter o token de autenticação
  getAuthToken() {
    return localStorage.getItem('access_token') || localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  // Método para definir o token de autenticação
  setAuthToken(accessToken, refreshToken = null) {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      // Compatibilidade com código legado.
      localStorage.setItem('token', accessToken);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
    }

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    } else if (accessToken === null) {
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshAccessToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = fetch(`${this.baseURL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status}`);
        }
        const data = await response.json();
        this.setAuthToken(data.access, data.refresh || refresh);
        return data.access;
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}, retry = true) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    // Detectar se é FormData para não adicionar Content-Type
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        // Só adicionar Content-Type se não for FormData
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (
          response.status === 401 &&
          retry &&
          !endpoint.includes('/auth/login/') &&
          !endpoint.includes('/auth/register/') &&
          !endpoint.includes('/auth/refresh/')
        ) {
          try {
            await this.refreshAccessToken();
            return this.request(endpoint, options, false);
          } catch (refreshError) {
            this.setAuthToken(null, null);
            throw refreshError;
          }
        }
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
      body: data instanceof FormData ? data : JSON.stringify(data),
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
      body: data instanceof FormData ? data : JSON.stringify(data),
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
    if (response.access && response.refresh) {
      this.setAuthToken(response.access, response.refresh);
    } else if (response.token) {
      // fallback legado
      this.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    const refresh = this.getRefreshToken();
    if (refresh) {
      try {
        await this.post('/auth/logout/', { refresh });
      } catch (error) {
        console.warn('Falha ao invalidar refresh token no logout:', error);
      }
    }
    this.setAuthToken(null, null);
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

  async updateCurrentUser(userData) {
    return this.patch('/users/me/', userData);
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
    return this.patch(`/items/${id}/`, itemData);
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
