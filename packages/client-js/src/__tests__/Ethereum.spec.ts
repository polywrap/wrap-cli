import {Web3API, IPFS, Ethereum, Subgraph} from '../';
import {IPortals} from '../Web3API';
import {runW3CLI, generateName} from './helpers';

import fs from 'fs';
import gql from 'graphql-tag';
import axios from 'axios';

jest.setTimeout(150000);

describe('Ethereum', () => {
  let portals: IPortals;
  let apiCID: string;
  let apiENS: string;
  let address: string;

  beforeAll(async () => {
    // fetch providers from dev server
    const {
      data: {ipfs, ethereum, subgraph},
    } = await axios.get('http://localhost:4040/providers');

    if (!ipfs) {
      throw Error('Dev server must be running at port 4040');
    }

    // re-deploy ENS
    const {
      data: {ensAddress},
    } = await axios.get('http://localhost:4040/deploy-ens');

    // create a new ENS domain
    apiENS = `${generateName()}.eth`;

    // build & deploy the protocol
    const {exitCode, stdout, stderr} = await runW3CLI([
      'build',
      `${__dirname}/apis/eth-get-put-string/web3api.yaml`,
      '--output-dir',
      `${__dirname}/apis/eth-get-put-string/build`,
      '--ipfs',
      ipfs,
      '--test-ens',
      `${ensAddress},${apiENS}`,
    ]);

    if (exitCode !== 0) {
      console.error(`w3 exited with code: ${exitCode}`);
      console.log(`stderr:\n${stderr}`);
      console.log(`stdout:\n${stdout}`);
      throw Error('w3 CLI failed');
    }

    // get the IPFS CID of the published package
    const extractCID = /IPFS { (([A-Z]|[a-z]|[0-9])*) }/;
    const result = stdout.match(extractCID);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    apiCID = result[1];

    const eth = new Ethereum({
      provider: ethereum,
      ens: ensAddress,
    });

    portals = {
      ipfs: new IPFS({provider: ipfs}),
      ethereum: eth,
      subgraph: new Subgraph({provider: subgraph}),
    };

    // deploy an example version of the contract
    const abi = JSON.parse(
      fs.readFileSync(`${__dirname}/apis/eth-get-put-string/src/contracts/SimpleStorage.json`).toString()
    );
    const bytecode = `0x${abi.bytecode.object}`;
    address = await eth.deployContract(abi.abi, bytecode);
  });

  it('Deploy Contract', async () => {
    const api = new Web3API({
      uri: apiENS,
      portals,
    });

    const res = await api.query({
      query: gql`
        mutation DeployContract {
          deployContract
        }
      `,
    });

    expect(res.errors).toBeFalsy();
    expect(res.data.deployContract.indexOf('0x')).toBeGreaterThan(-1);
  });

  it('Set & Get', async () => {
    const testValue = 777;
    const api = new Web3API({
      uri: apiENS,
      portals,
    });

    const res = await api.query({
      query: gql`
        mutation SetData($address: String!, $value: Int!) {
          setData(address: $address, value: $value)
        }
      `,
      variables: {
        address,
        value: testValue,
      },
    });

    expect(res.errors).toBeFalsy();
    expect(res.data.setData.indexOf('0x')).toBeGreaterThan(-1);

    const res2 = await api.query({
      query: gql`
        query GetData($address: String!) {
          getData(address: $address)
        }
      `,
      variables: {
        address,
      },
    });

    expect(res2.errors).toBeFalsy();
    expect(res2.data.getData).toBe(testValue);
  });
});
