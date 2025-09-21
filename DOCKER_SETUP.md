# 🐳 Configuração Docker - Trade Site

## 📋 **Visão Geral**

Este projeto está configurado para rodar completamente em Docker, incluindo:
- **Backend Django** com PostgreSQL
- **Frontend React** com hot reload
- **Banco de dados** PostgreSQL

## 🚀 **Como Rodar**

### **Opção 1: Tudo Junto (Recomendado)**
```bash
# Na raiz do projeto
docker-compose up --build
```

### **Opção 2: Apenas Frontend**
```bash
# Na pasta frontend
cd frontend
docker-compose up --build
```

### **Opção 3: Apenas Backend**
```bash
# Na pasta backend
cd backend
docker-compose up --build
```

## 🌐 **URLs de Acesso**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **PostgreSQL**: localhost:5432

## 📁 **Estrutura Docker**

```
Trade-Site/
├── docker-compose.yml          # Orquestração completa
├── backend/
│   ├── Dockerfile             # Backend Django
│   ├── docker-compose.yml     # Backend isolado
│   └── requirements.txt       # Dependências Python
└── frontend/
    ├── Dockerfile             # Frontend React
    ├── docker-compose.yml     # Frontend isolado
    └── requirements.md        # Dependências Node.js
```

## 🔧 **Comandos Úteis**

### **Desenvolvimento**
```bash
# Rodar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Rebuild completo
docker-compose down --volumes --rmi all
docker-compose up --build
```

### **Manutenção**
```bash
# Limpar containers parados
docker-compose down --rmi all

# Limpar volumes (CUIDADO: apaga dados do banco)
docker-compose down --volumes

# Entrar no container do backend
docker-compose exec backend bash

# Entrar no container do frontend
docker-compose exec frontend sh

# Executar comandos Django
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## 🐛 **Troubleshooting**

### **Problema: Porta já em uso**
```bash
# Verificar processos usando as portas
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :5432

# Parar processos se necessário
sudo kill -9 <PID>
```

### **Problema: Erro de permissão**
```bash
# Dar permissões corretas
sudo chown -R $USER:$USER .
```

### **Problema: Cache do Docker**
```bash
# Limpar cache
docker system prune -a
docker volume prune
```

### **Problema: Node modules no frontend**
```bash
# Reinstalar dependências
docker-compose exec frontend npm install
```

## 📊 **Monitoramento**

### **Status dos Serviços**
```bash
# Ver status
docker-compose ps

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### **Recursos**
```bash
# Uso de recursos
docker stats
```

## 🔄 **Fluxo de Desenvolvimento**

1. **Fazer mudanças** no código
2. **Hot reload** funciona automaticamente
3. **Para mudanças no backend**: restart automático
4. **Para mudanças no frontend**: hot reload instantâneo

## 🚀 **Produção**

### **Build de Produção**
```bash
# Backend
cd backend
docker build -t trade-site-backend .

# Frontend
cd frontend
docker build -t trade-site-frontend .
```

### **Deploy**
```bash
# Usar docker-compose.prod.yml para produção
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 **Variáveis de Ambiente**

### **Backend**
- `DEBUG=1` - Modo debug
- `SECRET_KEY` - Chave secreta Django
- `DATABASE_URL` - URL do banco
- `ALLOWED_HOSTS` - Hosts permitidos

### **Frontend**
- `REACT_APP_API_URL` - URL da API
- `CHOKIDAR_USEPOLLING` - Hot reload no Docker

## 🎯 **Vantagens do Docker**

✅ **Ambiente consistente** em qualquer máquina
✅ **Fácil setup** - apenas `docker-compose up`
✅ **Isolamento** de dependências
✅ **Hot reload** funcionando
✅ **Banco de dados** incluído
✅ **Portas configuradas** automaticamente
✅ **Volumes** para desenvolvimento
✅ **Health checks** para dependências

## 🆘 **Suporte**

Se encontrar problemas:

1. **Verificar logs**: `docker-compose logs`
2. **Rebuild**: `docker-compose up --build`
3. **Limpar tudo**: `docker-compose down --volumes --rmi all`
4. **Verificar portas**: `sudo lsof -i :3000 :8000 :5432`
