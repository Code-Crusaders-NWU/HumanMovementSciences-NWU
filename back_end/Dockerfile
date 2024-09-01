FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

ENV URI=mongoDB

EXPOSE 8080

CMD [ "npm","start"]