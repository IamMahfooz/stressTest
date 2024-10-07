#Single-stage
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5003
ENTRYPOINT ["node","index.js"]
