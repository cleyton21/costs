#!/bin/sh

echo "Iniciando nginx..."
nginx

echo "Iniciando json-server na porta 5000..."
cd /app && json-server --watch db.json --port 5000 --host 0.0.0.0 --middlewares /app/middleware.js
