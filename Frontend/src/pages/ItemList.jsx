import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, TrendingUp, Grid, List } from 'lucide-react';

const ItemList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'Todas as categorias' },
    { id: 'matematica', name: 'Matemática' },
    { id: 'fisica', name: 'Física' },
    { id: 'quimica', name: 'Química' },
    { id: 'biologia', name: 'Biologia' },
    { id: 'historia', name: 'História' },
    { id: 'literatura', name: 'Literatura' },
    { id: 'idiomas', name: 'Idiomas' },
    { id: 'engenharia', name: 'Engenharia' },
    { id: 'medicina', name: 'Medicina' }
  ];

  const items = [
    {
      id: 1,
      title: "Cálculo I - James Stewart",
      author: "James Stewart",
      category: "Matemática",
      condition: "Muito Bom",
      currentBid: "R$ 45,00",
      bidsCount: 3,
      timeLeft: "2 dias",
      description: "Livro em excelente estado, com algumas anotações a lápis.",
      seller: "João Silva",
      location: "São Paulo, SP"
    },
    {
      id: 2,
      title: "Física Conceitual - Paul Hewitt",
      author: "Paul Hewitt",
      category: "Física",
      condition: "Bom",
      currentBid: "R$ 35,00",
      bidsCount: 5,
      timeLeft: "1 dia",
      description: "Livro usado, mas bem conservado. Sem rabiscos.",
      seller: "Maria Santos",
      location: "Rio de Janeiro, RJ"
    },
    {
      id: 3,
      title: "Química Orgânica - Solomons",
      author: "T.W. Graham Solomons",
      category: "Química",
      condition: "Excelente",
      currentBid: "R$ 60,00",
      bidsCount: 7,
      timeLeft: "3 dias",
      description: "Livro praticamente novo, comprado e pouco usado.",
      seller: "Pedro Costa",
      location: "Belo Horizonte, MG"
    },
    {
      id: 4,
      title: "Biologia Campbell",
      author: "Neil A. Campbell",
      category: "Biologia",
      condition: "Bom",
      currentBid: "R$ 80,00",
      bidsCount: 4,
      timeLeft: "5 dias",
      description: "Edição mais recente, algumas páginas marcadas com marca-texto.",
      seller: "Ana Oliveira",
      location: "Porto Alegre, RS"
    },
    {
      id: 5,
      title: "História Geral - Boris Fausto",
      author: "Boris Fausto",
      category: "História",
      condition: "Muito Bom",
      currentBid: "R$ 25,00",
      bidsCount: 2,
      timeLeft: "4 dias",
      description: "Livro bem conservado, ideal para vestibular e ENEM.",
      seller: "Carlos Mendes",
      location: "Brasília, DF"
    },
    {
      id: 6,
      title: "Dom Casmurro - Machado de Assis",
      author: "Machado de Assis",
      category: "Literatura",
      condition: "Excelente",
      currentBid: "R$ 15,00",
      bidsCount: 6,
      timeLeft: "6 dias",
      description: "Edição especial com comentários e análises.",
      seller: "Lucia Ferreira",
      location: "Salvador, BA"
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.category.toLowerCase() === categories.find(c => c.id === selectedCategory)?.name.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.currentBid.replace('R$ ', '').replace(',', '.')) - 
               parseFloat(b.currentBid.replace('R$ ', '').replace(',', '.'));
      case 'price-high':
        return parseFloat(b.currentBid.replace('R$ ', '').replace(',', '.')) - 
               parseFloat(a.currentBid.replace('R$ ', '').replace(',', '.'));
      case 'bids':
        return b.bidsCount - a.bidsCount;
      case 'ending':
        return a.timeLeft.localeCompare(b.timeLeft);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explorar Itens</h1>
          <p className="text-gray-600">Encontre o material didático que você precisa</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título ou autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Mais recentes</option>
                <option value="price-low">Menor preço</option>
                <option value="price-high">Maior preço</option>
                <option value="bids">Mais ofertas</option>
                <option value="ending">Terminando em breve</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              {sortedItems.length} {sortedItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid/List */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedItems.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{item.author}</p>
                    <p className="text-blue-600 text-sm mb-2">{item.category}</p>
                    <p className="text-sm text-gray-500 mb-3">Estado: {item.condition}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-green-600">{item.currentBid}</p>
                        <p className="text-xs text-gray-500">{item.bidsCount} ofertas</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.timeLeft}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-32 bg-gray-200 flex items-center justify-center rounded-md mr-4 flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.author}</p>
                        <p className="text-blue-600 text-sm">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{item.currentBid}</p>
                        <p className="text-xs text-gray-500">{item.bidsCount} ofertas</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Estado: {item.condition}</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timeLeft} restantes
                      </span>
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500">Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;

