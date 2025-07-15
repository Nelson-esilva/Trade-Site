import { Link } from 'react-router-dom';
import { BookOpen, Users, Shield, ArrowRight, Search, TrendingUp } from 'lucide-react';

const Home = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Cálculo I - James Stewart",
      author: "James Stewart",
      condition: "Muito Bom",
      currentBid: "R$ 45,00",
      bidsCount: 3,
      timeLeft: "2 dias",
      image: "/api/placeholder/200/250"
    },
    {
      id: 2,
      title: "Física Conceitual - Paul Hewitt",
      author: "Paul Hewitt",
      condition: "Bom",
      currentBid: "R$ 35,00",
      bidsCount: 5,
      timeLeft: "1 dia",
      image: "/api/placeholder/200/250"
    },
    {
      id: 3,
      title: "Química Orgânica - Solomons",
      author: "T.W. Graham Solomons",
      condition: "Excelente",
      currentBid: "R$ 60,00",
      bidsCount: 7,
      timeLeft: "3 dias",
      image: "/api/placeholder/200/250"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Troque seus livros de forma inteligente
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A plataforma que conecta estudantes para trocar material didático através de leilões seguros e transparentes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/items"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search className="mr-2 h-5 w-5" />
                Explorar Itens
              </Link>
              <button className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors">
                <BookOpen className="mr-2 h-5 w-5" />
                Cadastrar Meu Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um sistema simples e seguro para trocar seus materiais didáticos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre seu item</h3>
              <p className="text-gray-600">
                Adicione fotos, descrição e defina o valor mínimo para seu material didático
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba ofertas</h3>
              <p className="text-gray-600">
                Outros usuários podem oferecer dinheiro ou outros itens pelo seu material
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Finalize a troca</h3>
              <p className="text-gray-600">
                Escolha a melhor oferta e combine os detalhes da troca diretamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Itens em destaque
            </h2>
            <Link
              to="/items"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                  <p className="text-sm text-gray-500 mb-3">Estado: {item.condition}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{item.currentBid}</p>
                      <p className="text-xs text-gray-500">{item.bidsCount} ofertas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.timeLeft}</p>
                      <p className="text-xs text-gray-500">restantes</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se à nossa comunidade e comece a trocar seus materiais didáticos hoje mesmo
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Criar conta gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

