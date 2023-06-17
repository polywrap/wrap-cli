# Contributing
Thank you for considering contributing to the Polywrap CLI! We welcome contributions from the community to help improve and enhance the project. Look through this repository's [issues](https://github.com/polywrap/cli/issues) to see what we're focused on solving.

## Pre-Requisites
To be able to fully build and test all functionality within the CLI, you'll need the following programs installed:  
`nvm`  
`node`  
`yarn`  
`docker`  
`docker-compose`  
`cue`  

## Installation

From the root directory, run `nvm install && nvm use` to install the correct version of Node.JS. Next, run `yarn` to install all dependencies for all packages.

## Build

Running `yarn build` from the root directory will build all packages. After this, if you'd like to rebuild an individual package you're making changes to, simply run `yarn build` within the specific `./packages/...` folder you're working in.

## Testing

Run `yarn test` from the root to test everything, and `yarn test` within a specific package folder to test just that package.

## Feedback and Discussions
For questions, suggestions, or discussions, open an issue or create a discussion within the [Polywrap Discord](https://discord.polywrap.io).

Happy coding!
