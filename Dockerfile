FROM node:18-alpine

WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./
COPY db.json ./
COPY src ./src
COPY public ./public

# Instalar dependências e json-server
RUN npm install
RUN npm install -g json-server

# Build do React
RUN npm run build

# Configurar nginx
RUN apk add --no-cache nginx
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Mover build para diretório do nginx
RUN mv build /usr/share/nginx/html

# Configurar script de inicialização
COPY start.sh ./
RUN chmod +x start.sh

# Garantir que o db.json esteja no diretório correto
RUN cp db.json /app/db.json

EXPOSE 80 5000

CMD ["./start.sh"]
