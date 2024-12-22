# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Clone the repository
RUN apk add --no-cache git
RUN git clone https://github.com/cleyton21/costs.git .

# Install dependencies and build
RUN npm install
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install nginx
RUN apk add --no-cache nginx

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/db.json /app/
COPY --from=builder /app/package.json /app/

# Install json-server globally
RUN npm install -g json-server

# Copy config files
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY server.js /app/

# Create required nginx directory
RUN mkdir -p /run/nginx

# Create start script with proper error handling
RUN echo '#!/bin/sh\n\
echo "Starting nginx..."\n\
nginx\n\
echo "Starting json-server..."\n\
cd /app && exec json-server --watch db.json --port 5000 --host 0.0.0.0' > /app/start.sh

RUN chmod +x /app/start.sh

EXPOSE 80 5000

CMD ["/bin/sh", "/app/start.sh"]
