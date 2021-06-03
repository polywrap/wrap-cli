export const composedSchema = {
  query:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "scalar BigInt\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Query @imports(\n" +
    "  types: [\n" +
    '    "Ethereum_Query",\n' +
    '    "Ethereum_Connection"\n' +
    "  ]\n" +
    ") {\n" +
    "  getData(\n" +
    "    address: String!\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): UInt32!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "type Ethereum_Query @imported(\n" +
    '  uri: "w3://ens/ethereum.web3api.eth",\n' +
    '  namespace: "Ethereum",\n' +
    '  nativeType: "Query"\n' +
    ") {\n" +
    "  callView(\n" +
    "    address: String!\n" +
    "    method: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "type Ethereum_Connection @imported(\n" +
    "  uri: \"w3://ens/ethereum.web3api.eth\",\n" +
    "  namespace: \"Ethereum\",\n" +
    "  nativeType: \"Connection\"\n" +
    ") {\n" +
    "  node: String\n" +
    "  networkNameOrChainId: String\n" +
    "}\n" +
    "\n" +
    "### Imported Objects END ###\n",
  mutation:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "scalar BigInt\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Mutation @imports(\n" +
    "  types: [\n" +
    '    "Ethereum_Mutation",\n' +
    '    "Ethereum_Connection"\n' +
    "  ]\n" +
    ") {\n" +
    "  setData(\n" +
    "    options: SetDataOptions!\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): SetDataResult!\n" +
    "\n" +
    "  deployContract(\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "type SetDataOptions {\n" +
    "  address: String!\n" +
    "  value: UInt32!\n" +
    "}\n" +
    "\n" +
    "type SetDataResult {\n" +
    "  txReceipt: String!\n" +
    "  value: UInt32!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "type Ethereum_Mutation @imported(\n" +
    '  uri: "w3://ens/ethereum.web3api.eth",\n' +
    '  namespace: "Ethereum",\n' +
    '  nativeType: "Mutation"\n' +
    ") {\n" +
    "  sendTransaction(\n" +
    "    address: String!\n" +
    "    method: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "\n" +
    "  deployContract(\n" +
    "    abi: String!\n" +
    "    bytecode: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "type Ethereum_Connection @imported(\n" +
    "  uri: \"w3://ens/ethereum.web3api.eth\",\n" +
    "  namespace: \"Ethereum\",\n" +
    "  nativeType: \"Connection\"\n" +
    ") {\n" +
    "  node: String\n" +
    "  networkNameOrChainId: String\n" +
    "}\n" +
    "\n" +
    "### Imported Objects END ###\n",
  combined:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "scalar BigInt\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Query @imports(\n" +
    "  types: [\n" +
    '    "Ethereum_Query",\n' +
    '    "Ethereum_Connection"\n' +
    "  ]\n" +
    ") {\n" +
    "  getData(\n" +
    "    address: String!\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): UInt32!\n" +
    "}\n" +
    "\n" +
    "type Mutation @imports(\n" +
    "  types: [\n" +
    '    "Ethereum_Mutation",\n' +
    '    "Ethereum_Connection"\n' +
    "  ]\n" +
    ") {\n" +
    "  setData(\n" +
    "    options: SetDataOptions!\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): SetDataResult!\n" +
    "\n" +
    "  deployContract(\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "type SetDataOptions {\n" +
    "  address: String!\n" +
    "  value: UInt32!\n" +
    "}\n" +
    "\n" +
    "type SetDataResult {\n" +
    "  txReceipt: String!\n" +
    "  value: UInt32!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "type Ethereum_Query @imported(\n" +
    '  uri: "w3://ens/ethereum.web3api.eth",\n' +
    '  namespace: "Ethereum",\n' +
    '  nativeType: "Query"\n' +
    ") {\n" +
    "  callView(\n" +
    "    address: String!\n" +
    "    method: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "type Ethereum_Mutation @imported(\n" +
    '  uri: "w3://ens/ethereum.web3api.eth",\n' +
    '  namespace: "Ethereum",\n' +
    '  nativeType: "Mutation"\n' +
    ") {\n" +
    "  sendTransaction(\n" +
    "    address: String!\n" +
    "    method: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "\n" +
    "  deployContract(\n" +
    "    abi: String!\n" +
    "    bytecode: String!\n" +
    "    args: [String!]\n" +
    "    connection: Ethereum_Connection\n" +
    "  ): String!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "type Ethereum_Connection @imported(\n" +
    "  uri: \"w3://ens/ethereum.web3api.eth\",\n" +
    "  namespace: \"Ethereum\",\n" +
    "  nativeType: \"Connection\"\n" +
    ") {\n" +
    "  node: String\n" +
    "  networkNameOrChainId: String\n" +
    "}\n" +
    "\n" +
    "### Imported Objects END ###\n",
};
