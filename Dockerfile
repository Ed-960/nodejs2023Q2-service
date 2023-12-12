# Build
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Prod
FROM node:14-alpine
WORKDIR /app
COPY ./ormconfig.js ./ormconfig.js
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]

