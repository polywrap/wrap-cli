const { TezosToolkit } = require('@taquito/taquito')
const { InMemorySigner } = require('@taquito/signer')

const { PORT } = require('./config')

function getClient() {
    const Tezos = new TezosToolkit(`http://localhost:${PORT}`)
    return Tezos
}

async function getSigner(secretKey) {
    return await InMemorySigner.fromSecretKey(secretKey)
}

module.exports = {
    getClient,
    getSigner
}