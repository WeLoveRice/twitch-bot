.PHONY: build test coverage generate_models

build:
	docker build . -t twitch-bot_discord

test: # Need to init ts-jest
	docker run twitch-bot_discord \
	yarn run test

coverage:
	docker run twitch-bot_discord yarn run coverage

generate_models:
	npx sequelize-auto -o "./models" -d lol -h localhost -c ./sequelize.json -e postgres --cm p --cf p --cp c -l ts
