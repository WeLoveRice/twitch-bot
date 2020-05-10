FROM node:12.16.3-buster-slim

RUN mkdir -p /home/node/twitch-bot/node_modules && chown -R node:node /home/node/twitch-bot
WORKDIR /home/node/twitch-bot
USER node
COPY package.json .
RUN npm install 

COPY --chown=node:node . .

RUN npm run build
CMD ["npm", "run", "start"]
