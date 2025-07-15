import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  User, 
  Star, 
  MessageCircle, 
  TrendingUp,
  DollarSign,
  Package,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState('');
  const [bidType, setBidType] = useState('money'); // 'money' or 'item'
  const [itemOffer, setItemOffer] = useState('');

  // Mock data - em um app real, isso viria de uma API
  const item = {
    id: 1,
    title: "Cálculo I - James Stewart",
    author: "James Stewart",
    edition: "8ª Edição",
    isbn: "978-85-221-2183-8",
    category: "Matemática",
    condition: "Muito Bom",
    currentBid: "R$ 45,00",
    minBid: "R$ 30,00",
    bidsCount: 3,
    timeLeft: "2 dias e 14 horas",
    description: "Livro em excelente estado de conservação. Possui algumas anotações a lápis que podem ser facilmente apagadas. Todas as páginas estão intactas e a capa está bem preservada. Ideal para estudantes de Cálculo I em cursos de Engenharia, Matemática e áreas afins.",
    seller: {
      name: "João Silva",
      rating: 4.8,
      reviewsCount: 23,
      location: "São Paulo, SP",
      memberSince: "2022"
    },
    images: [
      "/api/placeholder/400/500",
      "/api/placeholder/400/500",
      "/api/placeholder/400/500"
    ]
  };

  const bids = [
    {
      id: 1,
      bidder: "Maria Santos",
      amount: "R$ 45,00",
      type: "money",
      time: "2 horas atrás",
      message: "Interessada no livro, posso buscar pessoalmente."
    },
    {
      id: 2,
      bidder: "Pedro Costa",
      amount: "Livro de Física II",
      type: "item",
      time: "5 horas atrás",
      message: "Ofereço troca por livro de Física II do Halliday, em bom estado."
    },
    {
      id: 3,
      bidder: "Ana Oliveira",
      amount: "R$ 40,00",
      type: "money",
      time: "1 dia atrás",
      message: "Primeira oferta!"
    }
  ];

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para enviar a oferta
    console.log('Bid submitted:', { bidType, bidAmount, itemOffer });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/items" className="hover:text-blue-600 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para itens
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-24 w-24 text-gray-400" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {item.images.slice(1).map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <p className="text-lg text-gray-600 mb-1">por {item.author}</p>
                  <p className="text-sm text-blue-600">{item.category} • {item.edition}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-medium">{item.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ISBN</p>
                  <p className="font-medium">{item.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lance mínimo</p>
                  <p className="font-medium text-green-600">{item.minBid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ofertas</p>
                  <p className="font-medium">{item.bidsCount}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Bids History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Histórico de Ofertas
              </h3>
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{bid.bidder}</p>
                        <p className="text-sm text-gray-500">{bid.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">{bid.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          bid.type === 'money' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {bid.type === 'money' ? 'Dinheiro' : 'Troca'}
                        </span>
                      </div>
                    </div>
                    {bid.message && (
                      <p className="text-gray-600 text-sm">{bid.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Bid */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Lance atual</p>
                <p className="text-3xl font-bold text-green-600">{item.currentBid}</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
                <Clock className="h-4 w-4" />
                <span>Termina em {item.timeLeft}</span>
              </div>

              {/* Bid Form */}
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de oferta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBidType('money')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        bidType === 'money'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <DollarSign className="h-4 w-4 mx-auto mb-1" />
                      Dinheiro
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidType('item')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        bidType === 'item'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Package className="h-4 w-4 mx-auto mb-1" />
                      Troca
                    </button>
                  </div>
                </div>

                {bidType === 'money' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor da oferta
                    </label>
                    <input
                      type="text"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="R$ 50,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item para troca
                    </label>
                    <textarea
                      value={itemOffer}
                      onChange={(e) => setItemOffer(e.target.value)}
                      placeholder="Descreva o item que você quer oferecer em troca..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Fazer Oferta
                </button>
              </form>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Vendedor</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">{item.seller.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {item.seller.rating} ({item.seller.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{item.seller.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Membro desde {item.seller.memberSince}</span>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Enviar Mensagem</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

