FROM node:18-alpine

WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./
COPY db.json ./
COPY src ./src
COPY public ./public

# Instalar dependências
RUN npm install

# Instalar json-server globalmente
RUN npm install -g json-server

# Build do React
RUN npm run build

# Instalar e configurar nginx
RUN apk add --no-cache nginx
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Mover build para diretório do nginx
RUN mv build /usr/share/nginx/html

# Script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80 5000

CMD ["/app/start.sh"]
