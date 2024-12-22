#!/bin/sh

# Iniciar nginx em background
nginx

# Iniciar json-server
exec json-server --watch /app/db.json --port 5000 --host 0.0.0.0
