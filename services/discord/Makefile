.PHONY: build test

build:
	docker build . -t twitch-bot:discord

test:
	docker run twitch-bot:discord npm run test
