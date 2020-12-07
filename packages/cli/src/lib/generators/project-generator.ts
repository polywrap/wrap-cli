import {GluegunFilesystem} from 'gluegun';

export const generateProject = (projectName: string, fs: GluegunFilesystem): void => {
  const {dir, write} = fs;
  dir(projectName);
  dir(`${projectName}/src`);
  dir(`${projectName}/src/mutation`);
  dir(`${projectName}/src/query`);
  dir(`${projectName}/src/subgraph`);
  dir(`${projectName}/scripts`);
  dir(`${projectName}/tests`);
  write(`${projectName}/web3api.yaml`, WEB3API_YML);
  write(`${projectName}/package.json`, PACKAGE_JSON);
};

const WEB3API_YML = `description: TODO
repository: TODO
mutation:
  schema:
    file: ./mutation/schema.graphql
  module:
    language: wasm/assemblyscript
    file: ./mutation/index.ts
query:
  schema:
    file: ./query/schema.graphql
  module:
    language: wasm/assemblyscript
    file: ./query/index.ts
subgraph:
  file: ./subgraph/subgraph.yaml
`;

const PACKAGE_JSON = `{
  "name": "TODO",
  "scripts": {
    "build": "w3 build"
  },
  "dependencies": {
    "@web3api/cli": "0.0.1-alpha.1"
  }
}
`;
