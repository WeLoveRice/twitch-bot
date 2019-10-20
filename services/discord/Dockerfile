FROM node:10.16.3-buster

WORKDIR /bot

COPY package.json .
RUN npm i

ENTRYPOINT ["tail", "-f", "/dev/null"]

