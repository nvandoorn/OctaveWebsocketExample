FROM node:lts-alpine

RUN yarn

WORKDIR /usr/src/app
COPY . /usr/src/app

CMD ["yarn", "start"]
