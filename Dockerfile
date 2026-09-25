FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000 5001 5002 5003 5004
CMD ["node", "backend/start-all.js"]
