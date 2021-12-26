### Build Image
FROM node:14-alpine AS builder

WORKDIR /home/node/twitch-bot
RUN apk add python3 make g++ gcc
RUN mkdir -p ./node_modules
RUN chown -R node:node .
USER node

COPY package.json yarn.lock ./
RUN yarn install
COPY --chown=node:node . .
RUN yarn run build

### Production image
FROM node:14-alpine AS prod

WORKDIR /home/node/twitch-bot
USER node
COPY --from=builder /home/node/twitch-bot .

ENV NODE_ENV=production
CMD ["yarn", "run", "start"]
