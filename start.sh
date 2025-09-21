#!/bin/bash

# Script para iniciar o Trade Site com Docker
echo "🚀 Iniciando Trade Site..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Limpar containers antigos (opcional)
read -p "🧹 Deseja limpar containers e volumes antigos? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Limpando containers e volumes..."
    docker-compose down --volumes --rmi all
fi

# Construir e iniciar
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build

echo "✅ Trade Site iniciado!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000/api"
echo "👤 Admin Django: http://localhost:8000/admin"
