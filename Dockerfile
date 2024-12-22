# Build stage for React frontend
FROM node:18-alpine as frontend-build

WORKDIR /app

# Clone the repository
RUN apk add --no-cache git
RUN git clone https://github.com/cleyton21/costs.git .

# Install dependencies and build frontend
RUN npm install
RUN npm run build

# Final stage
FROM node:18-alpine

WORKDIR /app

# Install nginx
RUN apk add --no-cache nginx

# Copy frontend build
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy backend files
COPY --from=frontend-build /app/db.json /app/
COPY --from=frontend-build /app/package.json /app/

# Install production dependencies only
RUN npm install json-server

# Copy configuration files
COPY server.js /app/
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create directory for nginx to write runtime files
RUN mkdir -p /run/nginx

# Create and configure start script
RUN echo '#!/bin/sh\nnginx && node /app/server.js' > /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 80

# Set environment variable for React app to use the correct API URL
ENV REACT_APP_API_URL=/api

CMD ["/bin/sh", "/app/start.sh"]
