#!/bin/sh

# Aplica as migrações do banco de dados
echo "A aplicar as migrações do banco de dados..."
python manage.py migrate

# Inicia o servidor Gunicorn
echo "A iniciar o servidor Gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
