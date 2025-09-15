# ----------------------
# Build client bundle
# ----------------------
FROM node:18-alpine AS build
WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# Ensure Babel presets are present
RUN npm install --no-save @babel/preset-env @babel/preset-react
COPY .babelrc ./
RUN printf '{\n  "presets": ["@babel/preset-env", "@babel/preset-react"]\n}\n' > .babelrc

# Copy client sources and webpack config
COPY client ./client
COPY webpack.config.client.js webpack.config.client.production.cjs template.js ./

# Build client bundle
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npx webpack --config webpack.config.client.production.cjs

# ----------------------
# Serve via nginx
# ----------------------
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
