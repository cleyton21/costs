FROM node:18-alpine

# Instalar git e bash
RUN apk add --no-cache git bash

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

# Criar arquivo de configuração do nginx
RUN echo 'server { \n\
    listen 80;\n\
    server_name localhost;\n\
\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location /api/ {\n\
        proxy_pass http://127.0.0.1:5000/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_cache_bypass $http_upgrade;\n\
    }\n\
}' > /etc/nginx/http.d/default.conf

# Mover build para diretório do nginx
RUN mv build /usr/share/nginx/html

# Criar e configurar script de inicialização
RUN printf '#!/bin/bash\n\
echo "Iniciando nginx..."\n\
nginx\n\
echo "Iniciando json-server na porta 5000..."\n\
cd /app && json-server --watch db.json --port 5000 --host 0.0.0.0' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 80 5000

CMD ["/entrypoint.sh"]
