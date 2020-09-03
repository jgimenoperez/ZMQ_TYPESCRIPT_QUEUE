FROM node:12.18
WORKDIR /app
#COPY package*.json ./
USER root
RUN apt-get update && apt-get install nano
RUN npm init --y
#RUN npm install
RUN npm install zeromq@5
#RUN npm install -g pm2
COPY ./build ./build
#RUN pm2 start producer.js

#13
#CMD [ "node","producer.js" ]
#docker build -t node_zmq .

