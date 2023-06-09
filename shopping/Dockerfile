FROM node:latest

RUN npm i -g nodemon 

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

EXPOSE 3003

CMD ["npm","run", "dev"]
