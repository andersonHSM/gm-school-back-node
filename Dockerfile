FROM node:14

WORKDIR /app

COPY package*.json tsconfig.json .env ./


RUN [ "npm", "i" ]

COPY src ./src

CMD [ "npm", "run", "devStart" ]