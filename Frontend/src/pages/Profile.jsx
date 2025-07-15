import { useState } from 'react';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit3, 
  MapPin, 
  Star,
  Clock,
  DollarSign,
  Package,
  Eye,
  MessageCircle
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('my-items');

  // Mock user data
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    location: "São Paulo, SP",
    memberSince: "Janeiro 2022",
    rating: 4.8,
    reviewsCount: 23,
    completedTrades: 15
  };

  // Mock items data
  const myItems = [
    {
      id: 1,
      title: "Cálculo I - James Stewart",
      condition: "Muito Bom",
      currentBid: "R$ 45,00",
      bidsCount: 3,
      status: "active",
      timeLeft: "2 dias",
      views: 24
    },
    {
      id: 2,
      title: "Algoritmos - Cormen",
      condition: "Bom",
      currentBid: "R$ 80,00",
      bidsCount: 7,
      status: "active",
      timeLeft: "5 dias",
      views: 18
    },
    {
      id: 3,
      title: "Física Básica - Halliday",
      condition: "Excelente",
      currentBid: "R$ 65,00",
      bidsCount: 2,
      status: "sold",
      soldFor: "R$ 70,00",
      views: 31
    }
  ];

  const myBids = [
    {
      id: 1,
      itemTitle: "Química Orgânica - Solomons",
      seller: "Maria Santos",
      myBid: "R$ 55,00",
      currentBid: "R$ 60,00",
      bidType: "money",
      status: "outbid",
      timeLeft: "1 dia"
    },
    {
      id: 2,
      itemTitle: "Biologia Campbell",
      seller: "Pedro Costa",
      myBid: "Livro de Física II",
      currentBid: "R$ 80,00",
      bidType: "item",
      status: "winning",
      timeLeft: "3 dias"
    },
    {
      id: 3,
      itemTitle: "História do Brasil - Boris Fausto",
      seller: "Ana Oliveira",
      myBid: "R$ 30,00",
      currentBid: "R$ 30,00",
      bidType: "money",
      status: "winning",
      timeLeft: "6 horas"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'winning':
        return 'bg-green-100 text-green-800';
      case 'outbid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'sold':
        return 'Vendido';
      case 'winning':
        return 'Vencendo';
      case 'outbid':
        return 'Superado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{user.rating} ({user.reviewsCount} avaliações)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Membro desde {user.memberSince}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Novo Item</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{myItems.length}</p>
              <p className="text-sm text-gray-600">Itens Cadastrados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{user.completedTrades}</p>
              <p className="text-sm text-gray-600">Trocas Realizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{myBids.length}</p>
              <p className="text-sm text-gray-600">Ofertas Ativas</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('my-items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-items'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Meus Itens
              </button>
              <button
                onClick={() => setActiveTab('my-bids')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-bids'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Minhas Ofertas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-items' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Meus Itens Cadastrados</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    + Adicionar novo item
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {myItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-4">
                          <div className="w-16 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <p className="text-gray-600 text-sm">Estado: {item.condition}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{item.views} visualizações</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{item.bidsCount} ofertas</span>
                              </div>
                              {item.status === 'active' && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{item.timeLeft} restantes</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                          <p className="text-lg font-bold text-green-600 mt-2">
                            {item.status === 'sold' ? item.soldFor : item.currentBid}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'my-bids' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Minhas Ofertas</h3>
                
                <div className="grid gap-4">
                  {myBids.map((bid) => (
                    <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{bid.itemTitle}</h4>
                          <p className="text-gray-600 text-sm">Vendedor: {bid.seller}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <div className="flex items-center space-x-1">
                              {bid.bidType === 'money' ? (
                                <DollarSign className="h-4 w-4 text-green-600" />
                              ) : (
                                <Package className="h-4 w-4 text-blue-600" />
                              )}
                              <span>Minha oferta: <strong>{bid.myBid}</strong></span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{bid.timeLeft} restantes</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                            {getStatusText(bid.status)}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">
                            Lance atual: <strong className="text-green-600">{bid.currentBid}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

