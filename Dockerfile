FROM node:18-alpine

# Instalar git
RUN apk add --no-cache git

WORKDIR /app

# Clonar o repositório
RUN git clone https://github.com/cleyton21/costs.git .

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

EXPOSE 80 5000

CMD ["./start.sh"]
