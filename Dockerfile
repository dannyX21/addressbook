FROM node:alpine

ENV MONGODB_USER=admin
ENV MONGODB_PASSWORD=password

RUN mkdir -p /home/app
WORKDIR /home/app
RUN cd /home/app
COPY . /home/app
RUN npm install
RUN npm install -g nodemon

CMD ["nodemon", "server.js"]