### Build Image
FROM node:12-alpine AS builder

WORKDIR /home/node/twitch-bot
RUN apk add python3 make g++ gcc
RUN mkdir -p ./node_modules
RUN chown -R node:node .
USER node

COPY package.json .
RUN npm install
COPY --chown=node:node . .
RUN npm run build
# npm prune --production fails to run
RUN rm -rf node_modules
RUN npm install --production

### Production image
FROM node:12-alpine

WORKDIR /home/node/twitch-bot
USER node
COPY --from=builder /home/node/twitch-bot .

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
