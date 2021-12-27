# Dev Image
FROM node:14-alpine AS dev

WORKDIR /home/node/twitch-bot
RUN apk add make g++ gcc ffmpeg curl
# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

## Install youtube-dl
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+rx /usr/local/bin/youtube-dl

COPY package.json yarn.lock ./
RUN yarn install
COPY . .


# Production image
FROM node:14-alpine AS prod
RUN apk add ffmpeg
# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /home/node/twitch-bot

COPY --from=dev /usr/local/bin/youtube-dl /usr/local/bin/youtube-dl
COPY --from=dev /home/node/twitch-bot .

RUN yarn run build
RUN mkdir -p ./build/logs
RUN chown -R node:node .

USER node
ENV NODE_ENV=production
CMD ["yarn", "run", "start"]
