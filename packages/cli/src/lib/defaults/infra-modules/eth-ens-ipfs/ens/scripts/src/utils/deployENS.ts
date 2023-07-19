import { loadContract, deploy, utf8ToKeccak256, computeInterfaceId } from "./utils";

import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ensJSON = loadContract( "registry", "ENSRegistry");
const dummyOracleJSON = loadContract( "ethregistrar", "DummyOracle");
const stablePriceOracleJSON = loadContract( "ethregistrar", "StablePriceOracle");
const baseRegistrarJSON = loadContract( "ethregistrar", "BaseRegistrarImplementation");
const ethControllerJSON = loadContract( "deployments", "ETHRegistrarController");
const reverseRegistrarJSON = loadContract("deployments", "ReverseRegistrar");
const nameWrapperJSON = loadContract( "deployments", "NameWrapper");
const publicResolverJSON = loadContract( "deployments", "PublicResolver");

const iNameWrapperJSON = loadContract( "wrapper", "INameWrapper");
const iEthControllerJSON = loadContract( "ethregistrar", "IETHRegistrarController");

const tld = "eth";

export async function deployENS(provider: ethers.providers.JsonRpcProvider) {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  // Registry
  console.log("deploying registry");
  const ens = await deploy(provider, ensJSON);

  // Reverse Registrar
  console.log("deploying reverse registrar");
  const reverse = await deploy(
    provider,
    reverseRegistrarJSON,
    ens.address
  );
  console.log("setting up reverse registrar");
  await setupReverseRegistrar(ens, reverse, signerAddress);

  // Base Registrar
  console.log("deploying base registrar");
  const baseRegistrar = await deploy(
    provider,
    baseRegistrarJSON,
    ens.address,
    ethers.utils.namehash(tld)
  );
  console.log("setting up eth registrar");
  await setupBaseRegistrar(ens, baseRegistrar);

  // Name Wrapper
  console.log("deploying name wrapper");
  const nameWrapper = await deploy(
    provider,
    nameWrapperJSON,
    ens.address,
    baseRegistrar.address,
    ZERO_ADDRESS,
  );
  console.log("setting up name wrapper");
  await setupNameWrapper(baseRegistrar, nameWrapper);

  // Eth Registrar Controller
  console.log("deploying dummy oracle")
  const dummyOracle = await deploy(
    provider,
    dummyOracleJSON,
    0
  );
  console.log("deploying stable price oracle")
  const stablePriceOracle = await deploy(
    provider,
    stablePriceOracleJSON,
    dummyOracle.address,
    [0, 0, 0, 0, 0],
  );
  console.log("deploying eth registrar controller");
  const ethController: ethers.Contract = await deploy(
    provider,
    ethControllerJSON,
    baseRegistrar.address,
    stablePriceOracle.address,
    1,
    3655,
    reverse.address,
    nameWrapper.address,
    ens.address,
  );
  await setupEthRegistrar(ethController, nameWrapper, reverse);

  // Resolver
  console.log("deploying resolver")
  const resolver = await deploy(
    provider,
    publicResolverJSON,
    ens.address,
    nameWrapper.address,
    ethController.address,
    reverse.address,
  );
  console.log("setting up resolver")
  await setupResolver(ens, resolver, reverse, nameWrapper, ethController);

  return {
    ensAddress: ens.address,
    resolverAddress: resolver.address,
    registrarAddress: ethController.address,
    reverseAddress: reverse.address,
  };
}

async function setupBaseRegistrar(
  ens: ethers.Contract,
  registrar: ethers.Contract
) {
  await ens.setSubnodeOwner(
    ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
    utf8ToKeccak256(tld),
    registrar.address
  );
}

async function setupEthRegistrar(
  ethController: ethers.Contract,
  nameWrapper: ethers.Contract,
  reverseRegistrar: ethers.Contract,
) {
  await nameWrapper.setController(ethController.address, true);
  await reverseRegistrar.setController(ethController.address, true);
}

async function setupReverseRegistrar(
  ens: ethers.Contract,
  reverseRegistrar: ethers.Contract,
  accountAddress: string
) {
  await ens.setSubnodeOwner(
    ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
    utf8ToKeccak256("reverse"),
    accountAddress
  );
  await ens.setSubnodeOwner(
    ethers.utils.namehash("reverse"),
    utf8ToKeccak256("addr"),
    reverseRegistrar.address
  );
}

async function setupResolver(
  ens: ethers.Contract,
  resolver: ethers.Contract,
  reverseRegistrar: ethers.Contract,
  nameWrapper: ethers.Contract,
  ethController: ethers.Contract,
) {
  const tldNode = ethers.utils.namehash("eth");

  const iNameWrapper = new ethers.utils.Interface(iNameWrapperJSON.abi)
  const iNameWrapperId = computeInterfaceId(iNameWrapper);
  console.log(`setting resolver iNameWrapper interface with id ${iNameWrapperId}`)
  await resolver.setInterface(tldNode, iNameWrapperId, nameWrapper.address);

  const iEthController = new ethers.utils.Interface(iEthControllerJSON.abi)
  const iEthControllerId = computeInterfaceId(iEthController);
  console.log(`setting resolver iEthController interface with id ${iEthControllerId}`)
  await resolver.setInterface(tldNode, iEthControllerId, ethController.address);

  const resolverNode = ethers.utils.namehash("resolver.eth");
  console.log("calling ens.setResolver")
  await ens.setResolver(resolverNode, resolver.address);
  console.log("calling resolver.setAddr")
  await resolver.setAddr(resolverNode, resolver.address);
  console.log("calling reverseRegistrar.setDefaultResolver")
  await reverseRegistrar.setDefaultResolver(resolver.address);
}

async function setupNameWrapper(
  registrar: ethers.Contract,
  nameWrapper: ethers.Contract,
) {
  await registrar.addController(nameWrapper.address)
}
