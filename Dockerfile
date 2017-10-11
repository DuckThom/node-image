FROM node:8-alpine

ADD . /app

WORKDIR /app

RUN npm install

ENV DEBUG *

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
