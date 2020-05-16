### Build Image
FROM node:12-alpine AS builder

RUN apk add python3 make g++ gcc
RUN mkdir -p /home/node/twitch-bot/node_modules && chown -R node:node /home/node/twitch-bot
WORKDIR /home/node/twitch-bot
USER node

COPY package.json .
RUN npm install
COPY --chown=node:node . .
RUN npm run build
# Removing dev packages saves over half the original image size space
RUN rm -rf node_modules
RUN npm install --production

### Production image
FROM node:12-alpine

WORKDIR /home/node/twitch-bot
USER node
COPY --from=builder /home/node/twitch-bot .

CMD ["npm", "run", "start"]
