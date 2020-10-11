# Twitch-Bot
![Build Status](https://img.shields.io/github/workflow/status/WeLoveRice/twitch-bot/CI)
![Codecov](https://img.shields.io/codecov/c/github/WeLoveRice/twitch-bot)

A discord bot geared toward memes and other fun stuff

- See features

## Getting Started

Firstly clone this repository

### Prerequisites

Recommend to run and develop using [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

Alternatively you can use [nvm](https://github.com/nvm-sh/nvm) to install things locally

### Installing

#### Docker

1. Create an `.env` file in `services/discord/`
    - The content of the file should be `DISCORD_TOKEN=xxx`
    - Where `DISCORD_TOKEN` is your token in the discord api [found here](https://discord.com/developers/applications) 
1. Build and run the stack `$ docker-compose up --build`

#### Dev Server

1. To get into dev mode, create a file named `env.dev` and enter your discord token as above.
1. Then run `docker-compose -f docker-compose.dev.yml up --build`


## Running the tests

Assuming you have make installed:

1. `$ make build`
2. `$ make test`

Otherwise run the commands found in the makefile: `services/discord/Makefile`

### Coding style

The coding style is enforced by [ESLint](https://eslint.org/)
 
This repo uses the [official typescript eslint plugin](https://github.com/typescript-eslint/typescript-eslint)

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [discord.js](https://discord.js.org/#/) - The Discord API used

## Contributing

Just send in a MR

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Colin Cheung** - [Profile](https://github.com/ColinCee)

See also the list of [contributors](https://github.com/ColinCee/twitch-bot/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
