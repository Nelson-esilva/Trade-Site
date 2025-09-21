# Configuração Docker para Trade Site Backend

## Arquivos Configurados

### 1. Dockerfile
- Base: Python 3.11-slim
- Usuário não-root para segurança
- Otimizado para produção com Gunicorn
- Instalação de dependências do sistema necessárias

### 2. docker-compose.yml
- Serviço PostgreSQL para banco de dados
- Configuração de volumes para persistência
- Health checks para o banco de dados
- Variáveis de ambiente configuradas

### 3. requirements.txt
- Todas as dependências necessárias
- Versões específicas para compatibilidade
- Inclui Gunicorn para produção

### 4. settings.py
- Suporte para PostgreSQL via DATABASE_URL
- Configuração de variáveis de ambiente
- Logging configurado para Docker
- Arquivos estáticos e de mídia configurados

### 5. .dockerignore
- Otimização do build excluindo arquivos desnecessários

## Como usar

### 1. Desenvolvimento com Docker
```bash
# Construir e executar os containers
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f backend

# Parar os containers
docker-compose down
```

### 2. Comandos úteis
```bash
# Executar comandos Django no container
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic

# Acessar o shell do container
docker-compose exec backend bash

# Reconstruir apenas o backend
docker-compose up --build backend
```

### 3. Variáveis de Ambiente
As seguintes variáveis estão configuradas no docker-compose.yml:
- `PYTHONUNBUFFERED=1`: Para logs em tempo real
- `DEBUG=1`: Modo debug ativado
- `SECRET_KEY`: Chave secreta do Django
- `DATABASE_URL`: URL de conexão com PostgreSQL
- `ALLOWED_HOSTS`: Hosts permitidos

### 4. Volumes
- `.:/app`: Código da aplicação
- `static_volume:/app/static`: Arquivos estáticos
- `media_volume:/app/media`: Arquivos de mídia
- `postgres_data:/var/lib/postgresql/data`: Dados do PostgreSQL

### 5. Portas
- Backend: 8000
- PostgreSQL: 5432

## Troubleshooting

### Problema: Container não inicia
- Verifique se a porta 8000 não está em uso
- Execute `docker-compose down` e `docker-compose up --build`

### Problema: Erro de banco de dados
- Aguarde o health check do PostgreSQL completar
- Verifique os logs: `docker-compose logs db`

### Problema: Migrações não aplicadas
- Execute: `docker-compose exec backend python manage.py migrate`

### Problema: Arquivos estáticos não carregam
- Execute: `docker-compose exec backend python manage.py collectstatic`
