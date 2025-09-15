# ----------------------
# Build stage
# ----------------------
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency manifests first (better cache layer)
COPY package.json package-lock.json* yarn.lock* ./

# Install all deps (dev + prod so webpack can run)
RUN npm install

# Ensure Babel runtime/transform runtime plugin are present
RUN npm install --save @babel/runtime && \
    npm install --save-dev @babel/plugin-transform-runtime

# Copy application sources
COPY client ./client
COPY server ./server
COPY config ./config
COPY template.js ./template.js
COPY webpack.config.client.js webpack.config.client.production.cjs ./
COPY .babelrc ./

# Build client bundle
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npx webpack --config webpack.config.client.production.cjs

# ----------------------
# Runtime stage
# ----------------------
FROM node:18-alpine
WORKDIR /app

# Install prod dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy artifacts from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/config ./config
COPY --from=build /app/template.js ./template.js

EXPOSE 4000
CMD ["node", "server/server.js"]
