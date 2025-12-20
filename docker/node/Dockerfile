# 軽量なNode.jsイメージを使用
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g ts-node-dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]