#!/bin/bash

# Script para parar o Trade Site
echo "🛑 Parando Trade Site..."

# Parar containers
docker-compose down

echo "✅ Trade Site parado!"
