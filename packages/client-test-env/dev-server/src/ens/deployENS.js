import {
  DAYS,
  advanceTime,
  mine,
  registerName,
  loadContract,
  deploy,
} from './utils'
import { table } from 'table'
import { NameLogger } from './namelogger'
import { interfaces } from './interfaces'
const ROOT_NODE = '0x00000000000000000000000000000000'
// ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB
const contenthash =
  '0xe301017012204edd2984eeaf3ddf50bac238ec95c5713fb40b5e428b508fdbe55d3b9f155ffe'
const content =
  '0x736f6d65436f6e74656e74000000000000000000000000000000000000000000'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const toBN = require('web3-utils').toBN;
const {
  legacyRegistrar: legacyRegistrarInterfaceId,
  permanentRegistrar: permanentRegistrarInterfaceId,
  permanentRegistrarWithConfig: permanentRegistrarWithConfigInterfaceId,
  bulkRenewal: bulkRenewalInterfaceId,
  linearPriceOracle: linearPriceOracleInterfaceId
} = interfaces

async function deployENS({ web3, accounts, dnssec = false }) {
  const { sha3 } = web3.utils

  function namehash(name) {
    let node =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    if (name !== '') {
      let labels = name.split('.')
      for (let i = labels.length - 1; i >= 0; i--) {
        node = sha3(node + sha3(labels[i]).slice(2), {
          encoding: 'hex'
        })
      }
    }
    return node.toString()
  }
  const nameLogger = new NameLogger({ sha3, namehash })
  const registryJSON = loadContract('ens', 'ENSRegistry')
  const resolverJSON = loadContract('resolver', 'PublicResolver')
  const oldResolverJSON = loadContract('ens-022', 'PublicResolver')
  const reverseRegistrarJSON = loadContract('ens', 'ReverseRegistrar')
  const priceOracleJSON = loadContract('ethregistrar-202', 'SimplePriceOracle')
  const linearPremiumPriceOracleJSON = loadContract('ethregistrar', 'LinearPremiumPriceOracle')
  const dummyOracleJSON = loadContract('ethregistrar', 'DummyOracle')
  console.log({dummyOracleJSON: dummyOracleJSON.abi})
  const controllerJSON = loadContract('ethregistrar', 'ETHRegistrarController')
  const bulkRenewalJSON = loadContract('ethregistrar', 'BulkRenewal')
  const testRegistrarJSON = loadContract('ens', 'TestRegistrar')
  const legacyAuctionRegistrarSimplifiedJSON = loadContract(
    'ens',
    'HashRegistrar'
  )
  const ENSWithFallbackJSON = loadContract(
    'ethregistrar',
    'ENSRegistryWithFallback'
  )
  const oldBaseRegistrarJSON = loadContract(
    'ethregistrar',
    'OldBaseRegistrarImplementation'
  )
  const newBaseRegistrarJSON = loadContract(
    'ethregistrar',
    'BaseRegistrarImplementation'
  )
  const registrarMigrationJSON = loadContract(
    'ethregistrar',
    'RegistrarMigration'
  )
  const EthRegistrarSubdomainRegistrarJSON = loadContract(
    'subdomain-registrar',
    'EthRegistrarSubdomainRegistrar'
  )
  const ENSMigrationSubdomainRegistrarJSON = loadContract(
    'subdomain-registrar',
    'ENSMigrationSubdomainRegistrar'
  )

  console.log('Deploying from account ', accounts[0])

  /* Deploy the main contracts  */
  const ens = await deploy(web3, accounts[0], registryJSON)
  const resolver = await deploy(web3, accounts[0], resolverJSON, ens._address)
  const oldResolver = await deploy(
    web3,
    accounts[0],
    oldResolverJSON,
    ens._address
  )
  const oldReverseRegistrar = await deploy(
    web3,
    accounts[0],
    reverseRegistrarJSON,
    ens._address,
    resolver._address
  )
  const testRegistrar = await deploy(
    web3,
    accounts[0],
    testRegistrarJSON,
    ens._address,
    namehash('test')
  )
  // Disabled for now as the deploy was throwing error and this is not in use.
  const legacyAuctionRegistrar = await deploy(
    web3,
    accounts[0],
    legacyAuctionRegistrarSimplifiedJSON,
    ens._address,
    namehash('eth'),
    1493895600
  )

  const ensContract = ens.methods
  const resolverContract = resolver.methods
  const oldResolverContract = oldResolver.methods
  const oldReverseRegistrarContract = oldReverseRegistrar.methods

  const tld = 'eth'
  const tldHash = sha3(tld)

  /* Setup the root TLD */
  await ensContract
    .setSubnodeOwner(ROOT_NODE, tldHash, accounts[0])
    .send({ from: accounts[0] })
  await ensContract
    .setSubnodeOwner(ROOT_NODE, sha3('test'), accounts[0])
    .send({ from: accounts[0] })
  await ensContract
    .setResolver(namehash(''), resolver._address)
    .send({ from: accounts[0] })
  await ensContract
    .setResolver(namehash('eth'), resolver._address)
    .send({ from: accounts[0] })
  await ensContract
    .setResolver(namehash('test'), resolver._address)
    .send({ from: accounts[0] })
  await ensContract
    .setSubnodeOwner(ROOT_NODE, sha3('test'), testRegistrar._address)
    .send({ from: accounts[0] })
  await ensContract
    .setSubnodeOwner(ROOT_NODE, sha3('eth'), legacyAuctionRegistrar._address)
    .send({ from: accounts[0] })

  /* Setup the root reverse node */
  await ensContract
    .setSubnodeOwner(ROOT_NODE, sha3('reverse'), accounts[0])
    .send({ from: accounts[0] })
  nameLogger.record('reverse', { label: 'reverse' })

  await ensContract
    .setSubnodeOwner(namehash('reverse'), sha3('addr'), accounts[0])
    .send({ from: accounts[0] })
  console.log('setup root reverse with addr label')
  nameLogger.record('addr.reverse', { label: 'addr' })
  await ensContract
    .setResolver(namehash('addr.reverse'), resolver._address)
    .send({ from: accounts[0] })
  console.log('setup root reverse with public resolver')
  /* Setup the reverse subdomain: addr.reverse */
  await ensContract
    .setSubnodeOwner(
      namehash('reverse'),
      sha3('addr'),
      oldReverseRegistrar._address
    )
    .send({ from: accounts[0] })
  console.log('setup root reverse with the reverse registrar')
  /* Set the old hash registrar contract as the owner of .eth */
  await ensContract
    .setSubnodeOwner(ROOT_NODE, tldHash, legacyAuctionRegistrar._address)
    .send({ from: accounts[0] })
  nameLogger.record('eth', { label: 'eth' })

  console.log('Successfully setup old hash registrar')

  const now = (await web3.eth.getBlock('latest')).timestamp
  const priceOracle = await deploy(web3, accounts[0], priceOracleJSON, 1)
  const oldBaseRegistrar = await deploy(
    web3,
    accounts[0],
    oldBaseRegistrarJSON,
    ens._address,
    legacyAuctionRegistrar._address,
    namehash('eth'),
    now + 365 * DAYS
  )
  console.log('Successfully setup base registrar')
  const controller = await deploy(
    web3,
    accounts[0],
    controllerJSON,
    oldBaseRegistrar._address,
    priceOracle._address,
    2, // 10 mins in seconds
    86400 // 24 hours in seconds
  )

  console.log('Successfully setup permanent registrar controller')
  const oldBaseRegistrarContract = oldBaseRegistrar.methods
  const controllerContract = controller.methods

  console.log('Price oracle deployed at: ', priceOracle._address)
  console.log('Base registrar deployed at: ', oldBaseRegistrar._address)
  console.log('Controller deployed at: ', controller._address)

  await ensContract
    .setSubnodeOwner(ROOT_NODE, tldHash, accounts[0])
    .send({ from: accounts[0] })
  await resolverContract
    .setAuthorisation(namehash('eth'), accounts[0], true)
    .send({ from: accounts[0] })

  try {
    await resolverContract
      .setInterface(
        namehash('eth'),
        legacyRegistrarInterfaceId,
        legacyAuctionRegistrar._address
      )
      .send({
        from: accounts[0]
      })
  } catch (e) {
    console.log(e)
  }

  console.log(
    `Set .eth legacy registrar interface Id to ${legacyAuctionRegistrar._address}`
  )

  await resolverContract
    .setInterface(
      namehash('eth'),
      permanentRegistrarInterfaceId,
      controller._address
    )
    .send({ from: accounts[0] })

  console.log(
    `Set .eth permanent registrar interface Id to ${controller._address}`
  )

  /* Set the permanent registrar contract as the owner of .eth */
  await ensContract
    .setSubnodeOwner(ROOT_NODE, tldHash, oldBaseRegistrar._address)
    .send({ from: accounts[0] })

  console.log('Add controller to base registrar')
  await oldBaseRegistrarContract
    .addController(controller._address)
    .send({ from: accounts[0] })

  const newnames = [
    'resolver',
    'oldresolver'
  ]

  console.log('Register name')
  try {
    for (var i = 0; i < newnames.length; i++) {
      await registerName(web3, accounts[0], controllerContract, newnames[i])
      nameLogger.record(`${newnames[i]}.eth`, { label: newnames[i] })
    }
  } catch (e) {
    console.log('Failed to register a name', e)
  }

  /* Point the resolver.eth's resolver to the public resolver */
  console.log('Setting up resolvers')
  await ensContract
    .setResolver(namehash('resolver.eth'), resolver._address)
    .send({
      from: accounts[0]
    })
  await ensContract
    .setResolver(namehash('oldresolver.eth'), oldResolver._address)
    .send({ from: accounts[0] })
  /* Resolve the resolver.eth address to the address of the public resolver */
  await resolverContract
    .setAddr(namehash('resolver.eth'), resolver._address)
    .send({ from: accounts[0] })
  /* Resolve the oldresolver.eth address to the address of the public resolver */

  await resolverContract
    .setAddr(namehash('oldresolver.eth'), oldResolver._address)
    .send({
      from: accounts[0]
    })

  /* Resolve the resolver.eth content to a 32 byte content hash */
  console.log('Setting up contenthash')

  await resolverContract
    .setContenthash(namehash('resolver.eth'), contenthash)
    .send({ from: accounts[0], gas: 5000000 })
  await oldResolverContract
    .setContent(namehash('oldresolver.eth'), content)
    .send({ from: accounts[0] })

  /* Setup a reverse for account[0] to eth tld  */

  await oldReverseRegistrarContract
    .setName('eth')
    .send({ from: accounts[2], gas: 1000000 })

  await mine(web3)
  let current = await web3.eth.getBlock('latest')
  console.log(`The current time is ${new Date(current.timestamp * 1000)}`)
  const oldEns = ens
  const oldSubdomainRegistrar = await deploy(
    web3,
    accounts[0],
    EthRegistrarSubdomainRegistrarJSON,
    ens._address
  )
  const oldSubdomainRegistrarContract = oldSubdomainRegistrar.methods
  // Create the new subdomain registrar

  const subdomainRegistrar = await deploy(
    web3,
    accounts[0],
    ENSMigrationSubdomainRegistrarJSON,
    ens._address
  )

  // Create the new ENS registry and registrar
  const newEns = await deploy(
    web3,
    accounts[0],
    ENSWithFallbackJSON,
    oldEns._address
  )
  const newEnsContract = newEns.methods
  const newBaseRegistrar = await deploy(
    web3,
    accounts[0],
    newBaseRegistrarJSON,
    newEns._address,
    namehash('eth')
  )
  const newBaseRegistrarContract = newBaseRegistrar.methods
  await newBaseRegistrarContract
    .addController(accounts[0])
    .send({ from: accounts[0] })
  // Create the new controller

  // Dummy oracle with 1 ETH == 200 USD
  const dummyOracleRate = toBN(20000000000) // 200 * 1e8
  const dummyOracle = await deploy(
    web3,
    accounts[0],
    dummyOracleJSON,
    dummyOracleRate
  )
  const dummyOracleContract = dummyOracle.methods
  const latestAnswer = await dummyOracleContract.latestAnswer().call()
  console.log('Dummy USD Rate', {latestAnswer})
  // Premium starting price: 10 ETH = 2000 USD
  const premium = toBN('2000000000000000000000') // 2000 * 1e18
  const decreaseDuration = toBN(28 * DAYS)
  const decreaseRate = premium.div(decreaseDuration)
  const linearPriceOracle = await deploy(
    web3,
    accounts[0],
    linearPremiumPriceOracleJSON,
    dummyOracle._address,
    // Oracle prices from https://etherscan.io/address/0xb9d374d0fe3d8341155663fae31b7beae0ae233a#events
    // 0,0, 127, 32, 1
    [0, 0, toBN(20294266869609), toBN(5073566717402), toBN(158548959919)],
    premium,
    decreaseRate
  )
  const linearPriceOracleContract = linearPriceOracle.methods

  const newController = await deploy(
    web3,
    accounts[0],
    controllerJSON,
    newBaseRegistrar._address,
    linearPriceOracle._address,
    2, // 10 mins in seconds
    86400 // 24 hours in seconds
  )
  const newControllerContract = newController.methods
  
  // Create the new resolver
  const newResolver = await deploy(
    web3,
    accounts[0],
    resolverJSON,
    newEns._address
  )
  const newResolverContract = newResolver.methods
  // Set resolver to the new ENS
  async function addNewResolverAndRecords(name) {
    console.log('setting up ', name)
    const hash = namehash(name)
    console.log('resolver')
    await newEnsContract.setResolver(hash, newResolver._address).send({
      from: accounts[0]
    })
    console.log('addr')
    await newResolverContract.setAddr(hash, newResolver._address).send({
      from: accounts[0]
    })
    // ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB
    console.log('contenthash')
    await newResolverContract
      .setContenthash(hash, contenthash)
      .send({ gas: 5000000, from: accounts[0] })

    console.log('finished setting up', name)
  }

  const bulkRenewal = await deploy(
    web3,
    accounts[0],
    bulkRenewalJSON,
    newEns._address
  )

  let newTestRegistrar,
    newReverseRegistrar,
    registrarMigration,
    registrarMigrationContract

  if (dnssec) {
    // Redeploy under new registry
    await deployDNSSEC(web3, accounts, newEns)
  } else {
    await newEnsContract
      .setSubnodeOwner(ROOT_NODE, sha3('eth'), accounts[0])
      .send({ from: accounts[0] })
    await newEnsContract
      .setResolver(namehash('eth'), newResolver._address)
      .send({ from: accounts[0], gas: 6000000 })
    await newResolverContract
      .setAuthorisation(namehash('eth'), accounts[0], true)
      .send({ from: accounts[0] })
    await newResolverContract
      .setInterface(
        namehash('eth'),
        permanentRegistrarInterfaceId,
        newController._address
      )
      .send({ from: accounts[0] })
    await newResolverContract
      .setInterface(
        namehash('eth'),
        permanentRegistrarWithConfigInterfaceId,
        newController._address
      )
      .send({ from: accounts[0] })

    // We still need to know what legacyAuctionRegistrar is to check who can release deed.
    await newResolverContract
      .setInterface(
        namehash('eth'),
        legacyRegistrarInterfaceId,
        legacyAuctionRegistrar._address
      )
      .send({ from: accounts[0] })

    await newResolverContract
      .setInterface(
        namehash('eth'),
        bulkRenewalInterfaceId,
        bulkRenewal._address
      )
      .send({ from: accounts[0] })

    await newResolverContract
      .setInterface(
        namehash('eth'),
        linearPriceOracleInterfaceId,
        linearPriceOracle._address
      )
      .send({ from: accounts[0] })

    await newEnsContract
      .setSubnodeOwner(ROOT_NODE, sha3('eth'), newBaseRegistrar._address)
      .send({ from: accounts[0] })
    nameLogger.record('eth', { label: 'eth', migrated: true })
    newTestRegistrar = await deploy(
      web3,
      accounts[0],
      testRegistrarJSON,
      newEns._address,
      namehash('test')
    )
    const newTestRegistrarContract = newTestRegistrar.methods
    await newEnsContract
      .setSubnodeOwner(ROOT_NODE, sha3('test'), newTestRegistrar._address)
      .send({ from: accounts[0] })
    nameLogger.record('test', { label: 'test', migrated: true })
    newReverseRegistrar = await deploy(
      web3,
      accounts[0],
      reverseRegistrarJSON,
      newEns._address,
      newResolver._address
    )

    // Create the migration contract. Make it the owner of 'eth' on the old
    registrarMigration = await deploy(
      web3,
      accounts[0],
      registrarMigrationJSON,
      oldBaseRegistrar._address,
      newBaseRegistrar._address,
      oldSubdomainRegistrar._address,
      subdomainRegistrar._address
    )
    registrarMigrationContract = registrarMigration.methods
    await newBaseRegistrarContract
      .addController(registrarMigration._address)
      .send({ from: accounts[0] })
    await ensContract
      .setSubnodeOwner(ROOT_NODE, sha3('eth'), registrarMigration._address)
      .send({ from: accounts[0] })

    console.log('Migrating permanent registrar names')
    for (var i = 0; i < newnames.length; i++) {
      try {
        let name = newnames[i]
        let domain = `${name}.eth`
        let labelhash = sha3(name)
        nameLogger.record(domain, { label: name, migrated: true })
        let owner = await ensContract.owner(namehash(domain))
        if (owner === accounts[0]) {
          await ensContract
            .setTTL(namehash(domain), 123)
            .send({ from: accounts[0] })

          await ensContract
            .setResolver(namehash(domain), newResolver._address)
            .send({ from: accounts[0] })
        } else {
          console.log(
            `${domain} is not owned by ${accounts[0]} hence not setting ttl nor resolver`
          )
        }

        let tx = await registrarMigrationContract
          .migrate(labelhash)
          .send({ from: accounts[0], gas: 6000000 })
      } catch (e) {
        console.log(`Failed to migrate a name ${newnames[i]}`, e)
      }
    }

    console.log('Migrate legacy names')
    await newEnsContract
      .setResolver(namehash('resolver.eth'), newResolver._address)
      .send({ from: accounts[0] })

    console.log(
      'Set resolver.eth address to new resovler address',
      newResolver._address
    )
    await newResolverContract
      .setAddr(namehash('resolver.eth'), newResolver._address)
      .send({ from: accounts[0] })

    console.log(
      `Add Controller ${newController._address}  to new base registrar`
    )
    await newBaseRegistrarContract
      .addController(newController._address)
      .send({ from: accounts[0] })
    await registerName(
      web3,
      accounts[0],
      newControllerContract,
      'aftermigration'
    )

    // Set default resolver to the new one
    await newEnsContract
      .setSubnodeOwner(ROOT_NODE, sha3('reverse'), accounts[1])
      .send({ from: accounts[0] })
    nameLogger.record('reverse', { label: 'reverse', migrated: true })
    await newEnsContract
      .setSubnodeOwner(
        namehash('reverse'),
        sha3('addr'),
        newReverseRegistrar._address
      )
      .send({ from: accounts[1] })
    nameLogger.record('addr.reverse', { label: 'addr', migrated: true })
    async function setNewResolver(name) {
      await newEnsContract
        .setResolver(namehash(name), newResolver._address)
        .send({ from: accounts[0] })
    }

    const sixcharprice = await linearPriceOracleContract.price('somenonexsitingname122', 0, 12 * 30 * DAYS).call()
    const fourcharprice = await linearPriceOracleContract.price('1234', 0, 12 * 30 * DAYS).call()
    const threecharprice = await linearPriceOracleContract.price('123', 0, 12 * 30 * DAYS).call()

    console.log({sixcharprice, fourcharprice, threecharprice})

    // Disabled for now as configureDomain is throwing errorr
    // await subdomainRegistrarContract.migrateSubdomain(namehash.hash("ismoney.eth"), sha3("eth")).send({from: accounts[0]})
  }
  let response = {
    emptyAddress: '0x0000000000000000000000000000000000000000',
    ownerAddress: accounts[0],
    bulkRenewalAddress: bulkRenewal._address,
    legacyAuctionRegistrarAddress: legacyAuctionRegistrar._address,
    oldEnsAddress: ens._address,
    oldContentResolverAddresses: [oldResolver._address],
    oldResolverAddresses: [resolver._address, oldResolver._address],
    oldControllerAddress: controller._address,
    oldBaseRegistrarAddress: oldBaseRegistrar._address,
    reverseRegistrarAddress: oldReverseRegistrar._address,
    ensAddress: newEns._address,
    registrarMigration: registrarMigration && registrarMigration._address,
    resolverAddress: newResolver._address,
    reverseRegistrarAddress:
      newReverseRegistrar && newReverseRegistrar._address,
    reverseRegistrarOwnerAddress: accounts[0],
    controllerAddress: newController._address,
    baseRegistrarAddress: newBaseRegistrar._address,
    linearPriceOracle: linearPriceOracle._address,
    dummyOracle: dummyOracle._address
  }
  let config = {
    columns: {
      0: {
        alignment: 'left',
        width: 30
      },
      1: {
        alignment: 'center',
        width: 50
      }
    }
  }

  let contractNames = Object.keys(response)
  let contractAddressesTable = contractNames.map(key => {
    return [key, response[key]]
  })
  let output = table(contractAddressesTable, config)
  console.log('Deployed contracts')
  console.log(output)
  console.log('Names')
  const labels = nameLogger.generateTable()
  response.labels = {}
  labels.map((l, i) =>  i !== 0 ? response.labels[l[3].slice(2)] = l[2] : null )
  console.log(nameLogger.print())
  return response
}
export default deployENS
