.PHONY: build test coverage

build:
	docker build . -t twitch-bot_discord

test: # Need to init ts-jest
	docker run twitch-bot_discord \
	npm run test

coverage:
	docker run twitch-bot_discord npm run coverage