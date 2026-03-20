# ⚛️ Frontend Documentation - Trade Site

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Context API](#-context-api)
5. [Componentes](#-componentes)
6. [Páginas](#-páginas)
7. [Serviços](#-serviços)
8. [Roteamento](#-roteamento)
9. [Autenticação](#-autenticação)
10. [Estilização](#-estilização)
11. [Deploy](#-deploy)

---

## 🎯 Visão Geral

O frontend do Trade Site é uma aplicação React moderna que utiliza Material-UI para interface e Context API para gerenciamento de estado. A aplicação é responsiva e oferece uma experiência de usuário intuitiva para troca de itens acadêmicos.

### Características Principais

- **React 18** com hooks modernos
- **Material-UI (MUI)** para componentes
- **Context API** para estado global
- **React Router** para navegação
- **Responsive Design** para mobile e desktop
- **Autenticação por Token** com localStorage

---

## 📁 Estrutura do Projeto

```
frontend/src/
├── components/              # Componentes reutilizáveis
│   ├── ItemCard.jsx        # Card de item
│   ├── ImageEditModal.jsx  # Modal para editar imagem
│   ├── Layout/             # Layout da aplicação
│   │   ├── Layout.jsx      # Layout principal
│   │   └── header.jsx      # Cabeçalho
│   ├── ProtectedRoute.jsx  # Proteção de rotas
│   └── ProfileProtection.jsx # Proteção de perfil
├── contexts/               # Context API
│   └── AppContext.jsx      # Estado global
├── pages/                  # Páginas da aplicação
│   ├── Home.jsx           # Página inicial
│   ├── auth/              # Autenticação
│   │   ├── Login.jsx      # Login
│   │   └── Register.jsx   # Registro
│   ├── items/             # Itens
│   │   ├── ItemDetails.jsx # Detalhes do item
│   │   └── CreateItem.jsx  # Criar item
│   ├── offers/            # Ofertas
│   │   └── Offers.jsx     # Lista de ofertas
│   ├── Profile.jsx        # Perfil do usuário
│   ├── MyItems.jsx        # Meus itens
│   └── MyOffers.jsx       # Minhas ofertas
├── services/              # Serviços
│   └── api.js            # Cliente API
├── App.jsx               # Componente principal
├── App.css              # Estilos globais
├── index.jsx            # Ponto de entrada
├── main.jsx             # Configuração principal
├── theme.js             # Tema Material-UI
└── index.css            # Estilos base
```

---

## 🛠️ Tecnologias Utilizadas

### Dependências Principais

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@mui/material": "^5.11.0",
  "@mui/icons-material": "^5.11.0",
  "@emotion/react": "^11.10.5",
  "@emotion/styled": "^11.10.5"
}
```

### Scripts Disponíveis

```json
{
  "start": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0"
}
```

---

## 🔄 Context API

### AppContext.jsx

O `AppContext` gerencia todo o estado global da aplicação:

```javascript
const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  items: [],
  offers: [],
  loading: false,
  error: null,
  notifications: []
};
```

#### Actions Disponíveis

```javascript
// Autenticação
LOGIN_SUCCESS
LOGOUT
SET_USER

// Itens
SET_ITEMS
ADD_ITEM
UPDATE_ITEM
REMOVE_ITEM
SET_CURRENT_ITEM
UPDATE_CURRENT_ITEM

// Ofertas
SET_OFFERS
ADD_OFFER
UPDATE_OFFER
REMOVE_OFFER

// UI
SET_LOADING
SET_ERROR
ADD_NOTIFICATION
REMOVE_NOTIFICATION
```

#### Funções Principais

```javascript
// Autenticação
const { login, logout, registerUser } = useApp();

// Itens
const { 
  loadItems, 
  createItem, 
  updateItem, 
  deleteItem,
  loadItem,
  setCurrentItem 
} = useApp();

// Ofertas
const { 
  loadOffers, 
  createOffer, 
  acceptOffer, 
  refuseOffer 
} = useApp();

// UI
const { 
  loading, 
  error, 
  addNotification, 
  clearError 
} = useApp();
```

---

## 🧩 Componentes

### ItemCard.jsx

Card responsivo para exibir itens:

```javascript
const ItemCard = ({ 
  item, 
  showOwner = true, 
  compact = false,
  onFavorite,
  onShare,
  onViewDetails,
  onMakeOffer,
}) => {
  // Implementação do card
};
```

**Props:**
- `item`: Objeto com dados do item
- `showOwner`: Mostrar informações do dono
- `compact`: Layout compacto
- `onFavorite`: Callback para favoritar
- `onShare`: Callback para compartilhar
- `onViewDetails`: Callback para ver detalhes
- `onMakeOffer`: Callback para fazer oferta

### ImageEditModal.jsx

Modal para editar imagem do item:

```javascript
const ImageEditModal = ({ 
  open, 
  onClose, 
  onSave, 
  item 
}) => {
  // Implementação do modal
};
```

### ProtectedRoute.jsx

Componente para proteger rotas:

```javascript
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [] 
}) => {
  // Lógica de proteção
};
```

**Props:**
- `children`: Componente a ser renderizado
- `requireAuth`: Se requer autenticação
- `allowedRoles`: Roles permitidas

### ProfileProtection.jsx

Proteção específica para perfis:

```javascript
const ProfileProtection = ({ children }) => {
  // Verifica se usuário pode acessar o perfil
};
```

---

## 📄 Páginas

### Home.jsx

Página inicial com lista de itens:

```javascript
const Home = () => {
  const { 
    items, 
    loading, 
    error, 
    searchItems, 
    loadItems, 
    clearError 
  } = useApp();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    status: 'disponivel',
  });

  // Handlers
  const handleItemClick = (item) => {
    navigate(`/item/${item.id}`);
  };

  const handleMakeOffer = (item) => {
    navigate(`/item/${item.id}`);
  };

  // Renderização
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Filtros e busca */}
      {/* Lista de itens */}
    </Container>
  );
};
```

**Funcionalidades:**
- Lista de itens disponíveis
- Filtros por categoria
- Busca por título/descrição
- Cards responsivos
- Navegação para detalhes

### ItemDetails.jsx

Página de detalhes do item:

```javascript
const ItemDetails = () => {
  const { id } = useParams();
  const { 
    currentItem, 
    setCurrentItem,
    items, 
    loading, 
    error, 
    user,
    loadItem, 
    createOffer,
    clearError 
  } = useApp();

  // Estados locais
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    offer_type: 'item',
    item_offered: '',
    money_amount: '',
  });

  // Handlers
  const handleMakeOffer = () => {
    setShowOfferDialog(true);
  };

  const handleSubmitOffer = async () => {
    try {
      await createOffer({
        ...offerData,
        item_desired: parseInt(id),
      });
      setShowOfferDialog(false);
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
    }
  };

  // Renderização
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Detalhes do item */}
      {/* Botões de ação */}
      {/* Modais */}
    </Container>
  );
};
```

**Funcionalidades:**
- Detalhes completos do item
- Formulário para fazer ofertas
- Suporte a ofertas em dinheiro
- Botões de ação para administradores
- Modais para ofertas e status

### MyItems.jsx

Página para gerenciar itens do usuário:

```javascript
const MyItems = () => {
  const { 
    user, 
    isAuthenticated, 
    items, 
    loadItems, 
    deleteItem, 
    updateItem 
  } = useApp();

  // Estados locais
  const [imageEditModal, setImageEditModal] = useState({
    open: false,
    item: null
  });

  // Handlers
  const handleEditImage = (item) => {
    setImageEditModal({ open: true, item });
  };

  const handleSaveImage = async (itemId, imageData) => {
    try {
      await updateItem(itemId, { image_url: imageData.image_url });
      setImageEditModal({ open: false, item: null });
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      throw error;
    }
  };

  // Renderização
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Lista de itens */}
      {/* Modal de edição de imagem */}
    </Container>
  );
};
```

**Funcionalidades:**
- Lista de itens do usuário
- Edição de itens
- Exclusão de itens
- Edição de imagens
- Filtros por status

### MyOffers.jsx

Página para gerenciar ofertas:

```javascript
const MyOffers = () => {
  const { 
    user, 
    offers, 
    loadOffers, 
    acceptOffer, 
    refuseOffer 
  } = useApp();

  // Estados locais
  const [tabValue, setTabValue] = useState(0);

  // Filtros
  const receivedOffers = offers.filter(offer => 
    offer.item_desired_data?.owner === user?.username && 
    offer.status === 'pendente'
  );

  const sentOffers = offers.filter(offer => 
    offer.offerer === user?.username && 
    offer.status === 'pendente'
  );

  const historicalOffers = offers.filter(offer => 
    (offer.item_desired_data?.owner === user?.username || 
     offer.offerer === user?.username) && 
    (offer.status === 'aceita' || 
     offer.status === 'recusada' || 
     offer.status === 'trocado')
  );

  // Handlers
  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOffer(offerId);
    } catch (error) {
      console.error('Erro ao aceitar oferta:', error);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await refuseOffer(offerId);
    } catch (error) {
      console.error('Erro ao recusar oferta:', error);
    }
  };

  // Renderização
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tabs */}
      {/* Lista de ofertas */}
    </Container>
  );
};
```

**Funcionalidades:**
- Ofertas recebidas
- Ofertas enviadas
- Histórico de ofertas
- Ações de aceitar/recusar
- Filtros por status

---

## 🔧 Serviços

### api.js

Cliente HTTP para comunicação com o backend:

```javascript
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
  }

  // Gerenciamento de token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Método genérico para requisições
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
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos para itens
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

  // Métodos específicos para ofertas
  async getOffers() {
    return this.get('/offers/');
  }

  async createOffer(offerData) {
    return this.post('/offers/', offerData);
  }

  async acceptOffer(id) {
    return this.post(`/offers/${id}/accept/`);
  }

  async refuseOffer(id) {
    return this.post(`/offers/${id}/refuse/`);
  }

  // Métodos de autenticação
  async login(username, password) {
    const response = await this.post('/auth/login/', { username, password });
    this.setAuthToken(response.token);
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register/', userData);
    this.setAuthToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.get('/users/me/');
  }

  logout() {
    this.setAuthToken(null);
  }
}

export default new ApiService();
```

---

## 🛣️ Roteamento

### App.jsx

Configuração de rotas da aplicação:

```javascript
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
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
              
              {/* Rotas protegidas */}
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
              
              {/* Rota para perfil específico */}
              <Route path="/profile/:username" element={
                <ProtectedRoute>
                  <ProfileProtection>
                    <Profile />
                  </ProfileProtection>
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}
```

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login/Registro**: Usuário fornece credenciais
2. **Token**: Backend retorna token de autenticação
3. **Armazenamento**: Token é salvo no localStorage
4. **Requisições**: Token é incluído no header Authorization
5. **Logout**: Token é removido do localStorage

### Implementação

```javascript
// Login
const handleLogin = async (username, password) => {
  try {
    const response = await apiService.login(username, password);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    navigate('/');
  } catch (error) {
    console.error('Erro no login:', error);
  }
};

// Logout
const handleLogout = () => {
  apiService.logout();
  dispatch({ type: 'LOGOUT' });
  navigate('/login');
};

// Verificação de autenticação
const isAuthenticated = !!apiService.getAuthToken();
```

---

## 🎨 Estilização

### Tema Material-UI

```javascript
// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
```

### Estilos Responsivos

```javascript
// Uso de breakpoints
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  grid: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));
```

---

## 🚀 Deploy

### Build de Produção

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Variáveis de Ambiente

```env
# .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

---

## 📱 Responsividade

### Breakpoints

- **xs**: 0px+
- **sm**: 600px+
- **md**: 900px+
- **lg**: 1200px+
- **xl**: 1536px+

### Implementação

```javascript
// Hook para breakpoints
const useBreakpoint = () => {
  const theme = useTheme();
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= theme.breakpoints.values.xl) {
        setBreakpoint('xl');
      } else if (window.innerWidth >= theme.breakpoints.values.lg) {
        setBreakpoint('lg');
      } else if (window.innerWidth >= theme.breakpoints.values.md) {
        setBreakpoint('md');
      } else if (window.innerWidth >= theme.breakpoints.values.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints.values]);

  return breakpoint;
};
```

---

## 🧪 Testes

### Estrutura de Testes

```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   └── services/
├── setupTests.js
└── test-utils.js
```

### Exemplo de Teste

```javascript
// ItemCard.test.jsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import ItemCard from '../components/ItemCard';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

test('renders item card with title', () => {
  const mockItem = {
    id: 1,
    title: 'Test Item',
    description: 'Test Description',
    category: 'livros',
    status: 'disponivel'
  };

  renderWithTheme(<ItemCard item={mockItem} />);
  
  expect(screen.getByText('Test Item')).toBeInTheDocument();
});
```

---

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build
npm run build

# Lint
npm run lint

# Testes
npm test
```

### Estrutura de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
chore: tarefas de manutenção
```

---

## 🆕 Atualizações de Hoje (20/03/2026)

- Redesign amplo da interface com foco em consistência visual (tema, cards, header, grids e estados vazios).
- Correção de textos com caracteres UTF-8 em toda a aplicação.
- `ItemDetails`: proteção contra loop de carregamento em detalhe de item.
- `ItemDetails`: botão de oferta oculto quando o item pertence ao usuário logado.
- `MyOffers`: ação de cancelar oferta pendente enviada.
- `services/api.js` e `AppContext.jsx`: integração da ação `cancelOffer`.
- `CreateItem`: reformulação visual para formulário mais limpo, centralizado e responsivo.

**Documentação do Frontend atualizada em: Março 2026**
