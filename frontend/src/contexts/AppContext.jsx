import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Estado inicial
const initialState = {
  // Usuário
  user: null,
  isAuthenticated: false,
  
  // Itens
  items: [],
  currentItem: null,
  loadingItems: false,
  
  // Ofertas
  offers: [],
  currentOffer: null,
  loadingOffers: false,
  
  // UI
  loading: false,
  error: null,
  notifications: [],
};

// Tipos de ações
export const ActionTypes = {
  // Usuário
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  
  // Itens
  SET_ITEMS: 'SET_ITEMS',
  SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
  UPDATE_CURRENT_ITEM: 'UPDATE_CURRENT_ITEM',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  SET_LOADING_ITEMS: 'SET_LOADING_ITEMS',
  
  // Ofertas
  SET_OFFERS: 'SET_OFFERS',
  SET_CURRENT_OFFER: 'SET_CURRENT_OFFER',
  ADD_OFFER: 'ADD_OFFER',
  UPDATE_OFFER: 'UPDATE_OFFER',
  REMOVE_OFFER: 'REMOVE_OFFER',
  SET_LOADING_OFFERS: 'SET_LOADING_OFFERS',
  
  // UI
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // Usuário
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    
    // Itens
    case ActionTypes.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loadingItems: false,
      };
    
    case ActionTypes.SET_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.payload,
      };
    
    case ActionTypes.UPDATE_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.payload,
      };
    
    case ActionTypes.ADD_ITEM:
      return {
        ...state,
        items: [action.payload, ...state.items],
      };
    
    case ActionTypes.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        currentItem: state.currentItem?.id === action.payload.id ? action.payload : state.currentItem,
      };
    
    case ActionTypes.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        currentItem: state.currentItem?.id === action.payload ? null : state.currentItem,
      };
    
    case ActionTypes.SET_LOADING_ITEMS:
      return {
        ...state,
        loadingItems: action.payload,
      };
    
    // Ofertas
    case ActionTypes.SET_OFFERS:
      return {
        ...state,
        offers: action.payload,
        loadingOffers: false,
      };
    
    case ActionTypes.SET_CURRENT_OFFER:
      return {
        ...state,
        currentOffer: action.payload,
      };
    
    case ActionTypes.ADD_OFFER:
      return {
        ...state,
        offers: [action.payload, ...state.offers],
      };
    
    case ActionTypes.UPDATE_OFFER:
      return {
        ...state,
        offers: state.offers.map(offer =>
          offer.id === action.payload.id ? action.payload : offer
        ),
        currentOffer: state.currentOffer?.id === action.payload.id ? action.payload : state.currentOffer,
      };
    
    case ActionTypes.REMOVE_OFFER:
      return {
        ...state,
        offers: state.offers.filter(offer => offer.id !== action.payload),
        currentOffer: state.currentOffer?.id === action.payload ? null : state.currentOffer,
      };
    
    case ActionTypes.SET_LOADING_OFFERS:
      return {
        ...state,
        loadingOffers: action.payload,
      };
    
    // UI
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    default:
      return state;
  }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // === AÇÕES DE AUTENTICAÇÃO ===
  const login = useCallback(async (username, password) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await apiService.login(username, password);
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user: response.user } });
      return response;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao fazer login' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await apiService.registerUser(userData);
      // Não faz login automático - apenas registra o usuário
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return response;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao registrar usuário' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // === AÇÕES DE USUÁRIO ===
  const loadCurrentUser = useCallback(async () => {
    try {
      const token = apiService.getAuthToken();
      if (token) {
        const user = await apiService.getCurrentUser();
        dispatch({ type: ActionTypes.SET_USER, payload: user });
      } else {
        // Se não há token, limpar usuário
        dispatch({ type: ActionTypes.SET_USER, payload: null });
      }
    } catch (error) {
      // Se não conseguir carregar usuário, limpar estado
      console.log('Erro ao carregar usuário:', error);
      dispatch({ type: ActionTypes.SET_USER, payload: null });
    }
  }, []);

  const loadItems = useCallback(async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING_ITEMS, payload: true });
      const response = await apiService.getItems();
      const items = response.results || response || [];
      dispatch({ type: ActionTypes.SET_ITEMS, payload: items });
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao carregar itens' });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING_ITEMS, payload: false });
    }
  }, []);

  const loadOffers = useCallback(async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING_OFFERS, payload: true });
      const response = await apiService.getOffers();
      const offers = response.results || response || [];
      dispatch({ type: ActionTypes.SET_OFFERS, payload: offers });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao carregar ofertas' });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING_OFFERS, payload: false });
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      // Carregar itens primeiro (sempre funciona)
      await loadItems();
      
      // Carregar usuário atual (pode falhar se não autenticado)
      await loadCurrentUser();
      
      // Carregar ofertas apenas se autenticado
      const token = apiService.getAuthToken();
      if (token) {
        await loadOffers();
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  }, [loadCurrentUser, loadItems, loadOffers]);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  // === AÇÕES DE ITENS ===

  const loadItem = useCallback(async (id) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const item = await apiService.getItem(id);
      dispatch({ type: ActionTypes.SET_CURRENT_ITEM, payload: item });
      return item;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao carregar item' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  const setCurrentItem = useCallback((item) => {
    dispatch({ type: ActionTypes.UPDATE_CURRENT_ITEM, payload: item });
  }, []);

  const createItem = async (itemData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const item = await apiService.createItem(itemData);
      dispatch({ type: ActionTypes.ADD_ITEM, payload: item });
      addNotification('Item criado com sucesso!', 'success');
      return item;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao criar item' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const item = await apiService.updateItem(id, itemData);
      dispatch({ type: ActionTypes.UPDATE_ITEM, payload: item });
      addNotification('Item atualizado com sucesso!', 'success');
      return item;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao atualizar item' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const deleteItem = async (id) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await apiService.deleteItem(id);
      dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id });
      addNotification('Item removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao remover item' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // === AÇÕES DE OFERTAS ===

  const createOffer = async (offerData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const offer = await apiService.createOffer(offerData);
      dispatch({ type: ActionTypes.ADD_OFFER, payload: offer });
      addNotification('Oferta criada com sucesso!', 'success');
      return offer;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao criar oferta' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const acceptOffer = async (id) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const offer = await apiService.acceptOffer(id);
      dispatch({ type: ActionTypes.UPDATE_OFFER, payload: offer });
      
      // Atualizar itens relacionados se necessário
      if (offer.item_desired_data) {
        dispatch({ type: ActionTypes.UPDATE_ITEM, payload: { id: offer.item_desired_data.id, status: 'indisponível' } });
      }
      if (offer.item_offered_data) {
        dispatch({ type: ActionTypes.UPDATE_ITEM, payload: { id: offer.item_offered_data.id, status: 'indisponível' } });
      }
      
      addNotification('Oferta aceita com sucesso!', 'success');
      return offer;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao aceitar oferta' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const refuseOffer = async (id) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const offer = await apiService.refuseOffer(id);
      dispatch({ type: ActionTypes.UPDATE_OFFER, payload: offer });
      
      addNotification('Oferta recusada!', 'info');
      return offer;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao recusar oferta' });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // === AÇÕES DE UI ===
  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
    };
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notification.id });
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // === BUSCA ===
  const searchItems = useCallback(async (query, filters = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING_ITEMS, payload: true });
      const response = await apiService.searchItems(query, filters);
      const items = response.results || response || [];
      dispatch({ type: ActionTypes.SET_ITEMS, payload: items });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Erro ao buscar itens' });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING_ITEMS, payload: false });
    }
  }, []);

  // Valor do contexto
  const value = {
    // Estado
    ...state,
    
    // Ações de usuário
    login,
    loadCurrentUser,
    registerUser,
    logout,
    
    // Ações de itens
    loadItems,
    loadItem,
    setCurrentItem,
    createItem,
    updateItem,
    deleteItem,
    
    // Ações de ofertas
    loadOffers,
    createOffer,
    acceptOffer,
    refuseOffer,
    
    // Ações de UI
    addNotification,
    clearError,
    searchItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

export default AppContext;
