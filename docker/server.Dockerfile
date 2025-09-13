# Runtime-only image
FROM node:18-alpine

WORKDIR /app

# Install only production dependancies
COPY package.json ./
RUN npm install --omit=dev

# Copy what the server needs
COPY server ./server
COPY config ./config

COPY template.js ./template.js
COPY client ./client

ENV NODE_ENV=production
# Server defaults to 3000
EXPOSE 3000

CMD ["node", "server/server.js"]
