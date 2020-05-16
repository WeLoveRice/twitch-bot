.PHONY: build push

build:
	docker build services/discord -t twitch-bot_discord
push:
	docker tag twitch-bot_discord ccheung22/twitch-bot_discord
	docker push ccheung22/twitch-bot_discord
