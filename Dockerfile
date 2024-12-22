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

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy frontend build
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy backend files
COPY --from=frontend-build /app/db.json /app/
COPY --from=frontend-build /app/package.json /app/

# Install json-server
RUN npm install -g json-server

# Copy configuration files
COPY server.js /app/
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create directory for nginx
RUN mkdir -p /run/nginx

# Create supervisor configuration
RUN mkdir -p /etc/supervisor.d/
COPY supervisord.conf /etc/supervisor.d/supervisord.ini

EXPOSE 80

ENV REACT_APP_API_URL=/api

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor.d/supervisord.ini"]
