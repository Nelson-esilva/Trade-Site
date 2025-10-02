#!/bin/bash

# Script para parar o Trade Site
echo "🛑 Parando Trade Site..."

# Detectar comando Docker Compose correto
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Parar containers
$DOCKER_COMPOSE down

echo "✅ Trade Site parado!"
