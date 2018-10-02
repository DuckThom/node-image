FROM node:8-alpine

ADD . /app

WORKDIR /app

RUN rm -rf node_modules
RUN npm install

ENV DEBUG *

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
