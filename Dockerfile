FROM node:18-alpine

# Instalar git e bash
RUN apk add --no-cache git bash nginx

WORKDIR /app

# Clonar o repositório
RUN git clone https://github.com/cleyton21/costs.git .

# Instalar dependências e json-server
RUN npm install
RUN npm install -g json-server

# Build do React
RUN npm run build

# Configurar nginx
RUN mkdir -p /run/nginx

# Copiar o arquivo de configuração do nginx
COPY default.conf /etc/nginx/http.d/default.conf

# Mover build para diretório do nginx
RUN mv build /usr/share/nginx/html

# Criar e configurar script de inicialização
RUN printf '#!/bin/bash\n\
echo "Iniciando json-server na porta 5000..."\n\
json-server --watch /app/db.json --port 5000 --host 0.0.0.0 &\n\
echo "Iniciando nginx..."\n\
nginx -g "daemon off;"\n' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000 5000

CMD ["/entrypoint.sh"]