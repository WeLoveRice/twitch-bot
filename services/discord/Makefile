.PHONY: build test

build:
	docker build . -t twitch-bot:discord

test: # Need to init ts-jest
	docker run twitch-bot:discord \
	[ -f ./jest.config.js ] || npx ts-jest config:init; \
	npm run test
