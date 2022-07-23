require("dotenv").config({ path: `${__dirname}/.env` });

const Config = {
    PORT: process.env.TEZOS_POLYWRAP_PORT || 20000,
    BLOCK_TIME: process.env.TEZOS_POLYWRAP_BLOCK_TIME || 3,
    PLATFORM: process.env.TEZOS_POLYWRAP_PLATFORM || 'linux/arm64',
    PROTOCOL: process.env.TEZOS_POLYWRAP_PROTOCOL || 'Jakarta'
}

module.exports = Config