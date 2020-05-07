FROM node:12.16.3-buster-slim

WORKDIR /usr/local/src/twitch-bot
COPY package.json .
RUN npm i

COPY . .

CMD ["npm", "run", "start"]