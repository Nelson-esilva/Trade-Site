FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       postgresql-client \
       build-essential \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root
RUN adduser --disabled-password --gecos '' appuser

# Definir diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências Python
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# --- LINHAS NOVAS ADICIONADAS ABAIXO ---
# Copia o script de entrypoint para dentro do container
COPY ./entrypoint.sh /app/entrypoint.sh
# Dá permissão de execução ao script
RUN chmod +x /app/entrypoint.sh

# Criar diretórios necessários
RUN mkdir -p /app/static /app/media \
    && chown -R appuser:appuser /app

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 8000

# --- LINHA CMD ALTERADA ---
# Define o entrypoint para executar o nosso script
CMD ["/app/entrypoint.sh"]
