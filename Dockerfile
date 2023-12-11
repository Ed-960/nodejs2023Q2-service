FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm rebuild bcrypt --build-from-source
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]

