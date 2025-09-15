# ----------------------
# Build stage
# ----------------------
FROM node:18-alpine AS build

WORKDIR /app

# Install build tools needed for native modules
RUN apk add --no-cache python3 make g++

# Copy dependency manifests first (better cache layer)
COPY package.json yarn.lock* package-lock.json* ./

# Install all deps (prod + dev so client build works)
RUN npm install

# Ensure Babel runtime + transform runtime plugin are available
RUN npm install --save @babel/runtime && \
    npm install --save-dev @babel/plugin-transform-runtime

# Copy application source
COPY client ./client
COPY server ./server
COPY config ./config
COPY template.js ./template.js
COPY webpack.config.client.js webpack.config.client.production.cjs ./
COPY .babelrc ./

# Build client bundle (React app)
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npx webpack --config webpack.config.client.production.cjs

# ----------------------
# Runtime stage
# ----------------------
FROM node:18-alpine

WORKDIR /app

# Copy only prod deps
COPY package.json ./
RUN npm install --omit=dev

# Copy built artifacts and server code from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/config ./config
COPY --from=build /app/template.js ./template.js

# Expose API port
EXPOSE 4000

# Start Node server
CMD ["node", "server/server.js"]
