.PHONY: build test coverage

build:
	docker build . -t twitch-bot:discord

test: # Need to init ts-jest
	docker run twitch-bot:discord \
	npm run test

coverage:
	docker run twitch-bot:discord npm run coverage