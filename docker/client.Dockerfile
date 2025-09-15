# Build the production client bundle
FROM node:18-alpine AS build
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Ignore "engines" pin from package.json
ENV npm_config_engine_strict=false
# Optional safety for older webpack + Node 18
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install root dependencies
COPY package.json ./
RUN npm install

#  Ensure JSX transforms are available
RUN npm install --no-save @babel/preset-env @babel/preset-react
COPY .babelrc ./

#  Provide a minimal babel config
RUN printf '{\n  "presets": ["@babel/preset-env", "@babel/preset-react"]\n}\n' > .babelrc

# Copy  what the client build needs
COPY client ./client
COPY webpack.config.client.js webpack.config.client.production.cjs template.js ./

# Build the client
RUN npx webpack --config webpack.config.client.production.cjs

# Serve the  files
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
