FROM mongo:latest

# Copy the init script to this directory to run on startup
COPY init.js /docker-entrypoint-initdb.d/

EXPOSE 27017