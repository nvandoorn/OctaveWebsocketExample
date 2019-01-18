FROM node:lts-alpine

RUN yarn add ws

WORKDIR /usr/src/app
COPY . /usr/src/app

CMD ["node", "hello_octave.js"]
