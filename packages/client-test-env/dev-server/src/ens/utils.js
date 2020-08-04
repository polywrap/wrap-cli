import util from 'util'
import moment from 'moment'
export const DAYS = 24 * 60 * 60

export const advanceTime = util.promisify(function(web3, delay, done) {
  return web3.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [delay]
    },
    done
  )
})

export const mine = util.promisify(function(web3, done) {
  return web3.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'evm_mine'
    },
    done
  )
})

export const registerName = async function(
  web3,
  account,
  controllerContract,
  name,
  duration = 365 * DAYS
) {
  console.log(`Registering ${name}`)
  const secret =
    '0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
  const VALUE = duration + 1
  let newnameAvailable = await controllerContract.available(name).call()
  var commitment = await controllerContract
    .makeCommitment(name, account, secret)
    .call()
  await controllerContract.commit(commitment).send({ from: account })
  var minCommitmentAge = await controllerContract.minCommitmentAge().call()
  const time = await advanceTime(web3, parseInt(minCommitmentAge))
  await mine(web3)
  const value = await controllerContract.rentPrice(name, duration).call()
  const trx = await controllerContract
    .register(name, account, duration, secret)
    .send({ from: account, value: value, gas: 6000000 })
  
  const registeredAt = moment((await web3.eth.getBlock('latest')).timestamp * 1000)
  const expiresTimestamp = trx.events.NameRegistered.returnValues.expires
  const expires = moment(expiresTimestamp * 1000)
  const releasedDate = moment(expiresTimestamp * 1000).add(90, 'days')
  const endOfPremiumDate = moment(expiresTimestamp * 1000).add(90 + 28, 'days')

  console.log({
    name,
    registeredAt,
    expiresTimestamp,
    expires,
    releasedDate,
    endOfPremiumDate
  })
  
  // The name should be no longer available
  newnameAvailable = await controllerContract.available(name).call()
  if (newnameAvailable) throw `Failed to register "${name}"`
}

export async function auctionLegacyNameWithoutFinalise(
  web3,
  account,
  registrarContract,
  name
) {
  let labelhash = web3.utils.sha3(name)
  console.log(`Auctioning name ${name}.eth`)
  let value = web3.utils.toWei('1', 'ether')
  let salt = web3.utils.sha3('0x01')
  let auctionlength = 60 * 60 * 24 * 5
  let reveallength = 60 * 60 * 24 * 2
  let bidhash = await registrarContract
    .shaBid(labelhash, account, value, salt)
    .call()
  await registrarContract
    .startAuctionsAndBid([labelhash], bidhash)
    .send({ from: account, value: value, gas: 6000000 })
  await registrarContract.state(labelhash).call()
  await advanceTime(web3, parseInt(auctionlength - reveallength + 100))
  await mine(web3)
  await registrarContract.state(labelhash).call()
  await registrarContract
    .unsealBid(labelhash, value, salt)
    .send({ from: account, gas: 6000000 })
  await advanceTime(web3, parseInt(reveallength * 2))
  await mine(web3)
}

export const auctionLegacyName = async function(
  web3,
  account,
  registrarContract,
  name
) {
  await auctionLegacyNameWithoutFinalise(web3, account, registrarContract, name)
  const labelhash = web3.utils.sha3(name)
  await registrarContract.state(labelhash).call()
  await registrarContract
    .finalizeAuction(labelhash)
    .send({ from: account, gas: 6000000 })
}

export function loadContract(modName, contractName) {
  if (modName === 'ens') {
    const ens = require(`@ensdomains/ens`)
    return ens[contractName]
  }
  return require(`@ensdomains/${modName}/build/contracts/${contractName}`)
}

export function deploy(web3, account, contractJSON, ...args) {
  const contract = new web3.eth.Contract(contractJSON.abi)
  return contract
    .deploy({
      data: contractJSON.bytecode,
      arguments: args
    })
    .send({
      from: account,
      gas: 6700000
    })
}
